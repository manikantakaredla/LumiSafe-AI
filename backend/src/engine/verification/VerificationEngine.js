import { WorkOrder } from '../../models/WorkOrder.js';
import { RepairTeam } from '../../models/RepairTeam.js';
import { eventBus, EVENTS } from '../eventbus/eventBus.js';
import { v4 as uuidv4 } from 'uuid';

import { VerificationReport } from '../../models/VerificationReport.js';

class EvidenceVerificationEngine {
  constructor() {
    this.threshold = 85;
  }

  async initialize() {
    eventBus.on(EVENTS.EVIDENCE_UPLOADED, this.handleEvidenceUploaded.bind(this));
    console.log('[VerificationEngine] Subscribed to EVIDENCE_UPLOADED');
  }

  async handleEvidenceUploaded(eventData) {
    const { entityId, payload, correlationId } = eventData;
    
    try {
      console.log(`[VerificationEngine] Analyzing evidence for WorkOrder ${payload.workOrderId}...`);
      
      const order = await WorkOrder.findOne({ workOrderId: payload.workOrderId }).populate('complaintId');
      if (!order) return;

      // 1. Emit Verification Started
      eventBus.publish(EVENTS.VERIFICATION_STARTED, 'WorkOrder', order._id, { workOrderId: order.workOrderId }, 'AI Verification Engine', correlationId);

      const verificationStartTime = new Date();

      // Simulate AI processing delay
      await new Promise(r => setTimeout(r, 2500));

      const verificationEndTime = new Date();

      // 2. Compute AI metrics & SLAs
      const confidenceScore = payload.forceFail ? 65 : (85 + Math.floor(Math.random() * 10));
      const isApproved = confidenceScore >= this.threshold;
      const newStatus = isApproved ? 'RESOLVED' : 'MANUAL_REVIEW_REQUIRED';

      const responseTimeMins = order.acceptedAt ? Math.round((order.acceptedAt - order.createdAt) / 60000) : 0;
      const travelTimeMins = (order.arrivedAt && order.acceptedAt) ? Math.round((order.arrivedAt - order.acceptedAt) / 60000) : 0;
      const repairDurationMins = (order.repairStartedAt) ? Math.round((verificationStartTime - order.repairStartedAt) / 60000) : 0;
      const verificationDurationMins = Math.round((verificationEndTime - verificationStartTime) / 1000); // in secs for demo, but schema says mins. Let's use 1 min min.
      const totalResolutionTimeMins = Math.round((verificationEndTime - order.createdAt) / 60000);
      
      const targetSLAMins = 240;
      const slaStatus = totalResolutionTimeMins <= targetSLAMins ? 'Within SLA' : 'Exceeded SLA';

      // 3. Generate Verification Report
      const reportId = `VER-${Math.floor(Math.random() * 90000) + 10000}`;
      const vReport = new VerificationReport({
        reportId,
        workOrderId: order._id,
        engineerId: order.assignedEngineerId,
        repairTeamId: order.assignedTeamId,
        confidenceScore,
        gpsMatch: true, // Mocked as true
        timestampValidation: true,
        beforePhotoAvailable: !!payload.beforePhoto,
        afterPhotoAvailable: !!payload.afterPhoto,
        inventoryLogged: order.requiredInventory || [],
        decision: isApproved ? 'APPROVED' : 'MANUAL_REVIEW',
        reason: isApproved ? 'Visual evidence matches expected repair profile.' : 'Evidence unclear or incomplete. Manual review requested.',
        slaMetrics: {
          responseTimeMins,
          travelTimeMins,
          repairDurationMins,
          verificationDurationMins: verificationDurationMins || 1,
          totalResolutionTimeMins,
          targetSLAMins,
          slaStatus
        }
      });
      await vReport.save();

      // Emit Report Generated
      eventBus.publish(EVENTS.VERIFICATION_REPORT_GENERATED, 'VerificationReport', vReport._id, { reportId, workOrderId: order.workOrderId, decision: vReport.decision, slaMetrics: vReport.slaMetrics }, 'AI Verification Engine', correlationId);

      // 4. Update WorkOrder & Team State
      order.status = newStatus;
      if (isApproved) order.completedAt = verificationEndTime;
      await order.save();

      const team = await RepairTeam.findById(order.assignedTeamId);
      if (team) {
        if (isApproved) {
          team.status = 'AVAILABLE';
          team.activeWorkOrderId = null;
        } else {
          team.status = 'BLOCKED';
        }
        await team.save();
      }

      // Emit Outcome Event
      if (isApproved) {
        eventBus.publish(EVENTS.VERIFICATION_COMPLETED, 'WorkOrder', order._id, { workOrderId: order.workOrderId, reportId }, 'AI Verification Engine', correlationId);
      } else {
        eventBus.publish(EVENTS.VERIFICATION_MANUAL_REVIEW, 'WorkOrder', order._id, { workOrderId: order.workOrderId, reportId }, 'AI Verification Engine', correlationId);
      }

      // Keep Timeline update via STATUS_CHANGED for chronological list
      eventBus.publish(EVENTS.STATUS_CHANGED, 'Complaint', order.complaintId._id, {
          workOrderId: order.workOrderId,
          status: newStatus,
          engineerStatus: newStatus
      }, 'AI Verification Engine', correlationId);

      console.log(`[VerificationEngine] WorkOrder ${payload.workOrderId} processed. Score: ${confidenceScore}. Status -> ${newStatus}`);

    } catch (err) {
      console.error('[VerificationEngine] Failed to process evidence:', err);
    }
  }
}

export const verificationEngine = new EvidenceVerificationEngine();
