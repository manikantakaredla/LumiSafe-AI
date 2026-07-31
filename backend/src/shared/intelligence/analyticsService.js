/**
 * Analytics Service
 * Extracts MongoDB aggregation logic into a reusable shared layer.
 */
import { Complaint } from '../../models/Complaint.js';
import { WorkOrder } from '../../models/WorkOrder.js';
import { RepairTeam } from '../../models/RepairTeam.js';

class AnalyticsService {
  async getOperationalOverview() {
    // This is essentially what is in analyticsController.js, now reusable
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [complaintsToday, activeWOs, blockedWOs, resolvedWOs, criticalOpen] = await Promise.all([
      Complaint.countDocuments({ createdAt: { $gte: today } }),
      WorkOrder.countDocuments({ status: { $in: ['ASSIGNED', 'ACCEPTED', 'NAVIGATING', 'ARRIVED', 'REPAIRING', 'EVIDENCE_PENDING', 'VERIFYING'] } }),
      WorkOrder.countDocuments({ status: 'BLOCKED' }),
      WorkOrder.countDocuments({ status: { $in: ['RESOLVED', 'CLOSED'] }, 'timeline.timestamp': { $gte: today } }),
      WorkOrder.countDocuments({ priority: 'CRITICAL', status: { $nin: ['RESOLVED', 'CLOSED'] } })
    ]);

    return {
      totalComplaintsToday: complaintsToday,
      activeWorkOrders: activeWOs,
      blockedWorkOrders: blockedWOs,
      resolvedToday: resolvedWOs,
      criticalOpen
    };
  }

  async getTeamPerformance() {
    const teams = await RepairTeam.find({}).lean();
    // Dummy logic for MVP, normally this would aggregate WorkOrders per team
    return teams.map(t => ({
      name: t.name,
      completedToday: Math.floor(Math.random() * 10),
      status: t.status
    }));
  }
}

export const analyticsService = new AnalyticsService();
