import { WorkOrder } from '../../models/WorkOrder.js';
import { RepairTeam } from '../../models/RepairTeam.js';
import { routeOptimizerEngine } from '../../engine/routing/RouteOptimizerEngine.js';
import { eventBus, EVENTS } from '../../engine/eventbus/eventBus.js';
import { v4 as uuidv4 } from 'uuid';

export const optimizeRoutes = async (req, res, next) => {
  try {
    const unassignedOrders = await WorkOrder.find({ assignedTeamId: null }).populate('complaintId');
    const activeTeams = await RepairTeam.find({ status: { $in: ['Standby', 'Active'] } });

    if (unassignedOrders.length === 0) {
      return res.status(200).json({ success: true, message: 'No unassigned orders to optimize', data: [] });
    }

    const optimizationResults = [];
    const correlationId = uuidv4();

    for (const order of unassignedOrders) {
      const recommendation = await routeOptimizerEngine.optimize(order, activeTeams);
      
      if (recommendation) {
        order.assignedTeamId = recommendation.recommendedTeamId;
        order.status = 'ASSIGNED';
        await order.save();

        const team = await RepairTeam.findById(recommendation.recommendedTeamId);
        if (team) {
          team.status = 'ASSIGNED';
          team.activeWorkOrderId = order._id;
          await team.save();
        }

        optimizationResults.push({
          workOrderId: order.workOrderId,
          team: recommendation.recommendedTeamName,
          confidence: recommendation.confidence,
          explanation: recommendation.explanation
        });

        // Publish event for tracking and socket
        eventBus.publish(
          EVENTS.WORKORDER_ASSIGNED, 
          'Complaint', 
          order.complaintId._id,
          {
            workOrderId: order.workOrderId,
            teamId: recommendation.recommendedTeamId,
            teamName: recommendation.recommendedTeamName,
            aiExplanation: {
              reason: recommendation.explanation,
              confidence: `${recommendation.confidence}%`,
              expectedImpact: recommendation.expectedImpact
            }
          },
          req.user ? `user:${req.user._id}` : 'AI Route Optimizer',
          correlationId
        );
      }
    }

    res.status(200).json({
      success: true,
      message: 'Optimization complete',
      data: optimizationResults,
      meta: { correlationId, timestamp: new Date() }
    });
  } catch (err) {
    next(err);
  }
};

export const manualAssign = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { teamId, teamName, reason } = req.body;

    const order = await WorkOrder.findById(id).populate('complaintId');
    if (!order) return res.status(404).json({ success: false, message: 'Work Order not found' });

    let team;
    if (teamId) team = await RepairTeam.findById(teamId);
    else if (teamName) team = await RepairTeam.findOne({ name: teamName });

    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    const isReassignment = !!order.assignedTeamId && order.assignedTeamId.toString() !== teamId;
    
    order.assignedTeamId = teamId;
    order.status = 'ASSIGNED';
    await order.save();

    team.status = 'ASSIGNED';
    team.activeWorkOrderId = order._id;
    await team.save();

    const correlationId = uuidv4();

    const eventName = isReassignment ? EVENTS.WORKORDER_ASSIGNED : EVENTS.WORKORDER_ASSIGNED;
    // Note: The UI looks for WORKORDER_ASSIGNED, but we can treat it functionally similar

    eventBus.publish(
      eventName, 
      'Complaint',
      order.complaintId._id,
      {
        workOrderId: order.workOrderId,
        teamId: team._id,
        teamName: team.name,
        aiExplanation: {
          reason: reason || 'Manual Supervisor Override',
          confidence: '100%',
          expectedImpact: 'Supervisor Directed'
        },
        isOverride: true
      },
      req.user ? `user:${req.user._id}` : 'Supervisor',
      correlationId
    );

    res.status(200).json({
      success: true,
      message: 'Work Order assigned manually',
      data: order,
      meta: { correlationId, timestamp: new Date() }
    });
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, blockReason } = req.body;
    
    const order = await WorkOrder.findOne({ workOrderId: id }).populate('complaintId');
    if (!order) return res.status(404).json({ success: false, message: 'Work Order not found' });

    order.status = status;
    await order.save();

    const team = await RepairTeam.findById(order.assignedTeamId);
    
    const correlationId = uuidv4();

    if (team) {
      if (status === 'ACCEPTED') team.status = 'ASSIGNED';
      if (status === 'NAVIGATING') team.status = 'EN_ROUTE';
      if (status === 'ARRIVED') team.status = 'ON_SITE';
      if (status === 'REPAIRING') team.status = 'REPAIRING';
      if (status === 'BLOCKED') team.status = 'BLOCKED';
      if (status === 'RESOLVED' || status === 'CLOSED') {
        team.status = 'AVAILABLE';
        team.activeWorkOrderId = null;
      }
      await team.save();
    }

    eventBus.publish(
      EVENTS.STATUS_CHANGED,
      'Complaint',
      order.complaintId._id,
      {
        workOrderId: order.workOrderId,
        status: status,
        engineerStatus: status,
        blockReason: blockReason
      },
      req.user ? `user:${req.user._id}` : 'Field Engineer',
      correlationId
    );

    res.status(200).json({
      success: true,
      message: `Work Order status updated to ${status}`,
      data: { workOrderId: order.workOrderId, status }
    });

  } catch (err) {
    next(err);
  }
};
