import { WorkOrder } from '../../models/WorkOrder.js';
import { RepairTeam } from '../../models/RepairTeam.js';
import { routeOptimizerEngine } from '../../engine/routing/RouteOptimizerEngine.js';
import { eventBus, EVENTS } from '../../engine/eventbus/eventBus.js';
import { v4 as uuidv4 } from 'uuid';

export const optimizeRoutes = async (req, res, next) => {
  try {
    const unassignedOrders = await WorkOrder.find({ assignedTeamId: null }).populate('complaintId');
    const activeTeams = await RepairTeam.find({ status: 'AVAILABLE' });

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
    
    // Stamp SLA Timestamps natively
    const now = new Date();
    if (status === 'ACCEPTED' && !order.acceptedAt) order.acceptedAt = now;
    if (status === 'ARRIVED' && !order.arrivedAt) order.arrivedAt = now;
    if (status === 'REPAIRING' && !order.repairStartedAt) order.repairStartedAt = now;
    if (status === 'RESOLVED' && !order.completedAt) order.completedAt = now;

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

export const supervisorReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body;
    
    // action: APPROVE, REJECT, REQUEST_REWORK
    const order = await WorkOrder.findOne({ workOrderId: id }).populate('complaintId');
    if (!order) return res.status(404).json({ success: false, message: 'Work Order not found' });

    const previousStatus = order.status;
    let newStatus = '';
    let eventName = '';

    const team = await RepairTeam.findById(order.assignedTeamId);

    if (action === 'APPROVE') {
      newStatus = 'RESOLVED';
      order.completedAt = new Date();
      if (team) {
        team.status = 'AVAILABLE';
        team.activeWorkOrderId = null;
      }
      eventName = EVENTS.REPORT_RESOLVED;
    } else if (action === 'REJECT') {
      newStatus = 'CLOSED';
      order.completedAt = new Date();
      if (team) {
        team.status = 'AVAILABLE';
        team.activeWorkOrderId = null;
      }
      eventName = EVENTS.STATUS_CHANGED;
    } else if (action === 'REQUEST_REWORK') {
      newStatus = 'REPAIRING';
      if (team) team.status = 'REPAIRING';
      eventName = EVENTS.STATUS_CHANGED;
    } else {
      return res.status(400).json({ success: false, message: 'Invalid action' });
    }

    order.status = newStatus;
    await order.save();
    if (team) await team.save();

    // Create Audit Log
    const { SupervisorDecision } = await import('../../models/SupervisorDecision.js');
    const decision = new SupervisorDecision({
      workOrderId: order._id,
      supervisorId: req.user ? req.user._id : order.complaintId, // using mock user/ID if no auth
      action,
      reason,
      previousStatus,
      newStatus
    });
    await decision.save();

    const correlationId = uuidv4();

    // Timeline Update
    eventBus.publish(
      EVENTS.STATUS_CHANGED,
      'Complaint',
      order.complaintId._id,
      {
        workOrderId: order.workOrderId,
        status: newStatus,
        engineerStatus: newStatus,
        supervisorAction: action,
        supervisorReason: reason
      },
      req.user ? `user:${req.user._id}` : 'Supervisor',
      correlationId
    );

    res.status(200).json({
      success: true,
      message: `Supervisor review completed: ${action}`,
      data: { workOrderId: order.workOrderId, status: newStatus }
    });

  } catch (err) {
    next(err);
  }
};
