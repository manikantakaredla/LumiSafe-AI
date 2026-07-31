import { WorkOrder } from '../../models/WorkOrder.js';
import { RepairTeam } from '../../models/RepairTeam.js';
import { eventBus, EVENTS } from '../eventbus/eventBus.js';
import { v4 as uuidv4 } from 'uuid';

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
      
      // Simulate AI processing delay
      await new Promise(r => setTimeout(r, 2500));

      // Deterministic pseudo-random score based on order ID length/hash, but usually pass for happy path testing
      // If we want to simulate failure, we could pass a flag in the payload. Let's just randomize a bit but mostly pass.
      const confidenceScore = payload.forceFail ? 65 : (85 + Math.floor(Math.random() * 10));

      const isApproved = confidenceScore >= this.threshold;
      const newStatus = isApproved ? 'RESOLVED' : 'MANUAL_REVIEW_REQUIRED';

      const order = await WorkOrder.findOne({ workOrderId: payload.workOrderId }).populate('complaintId');
      if (!order) return;

      order.status = newStatus;
      await order.save();

      const team = await RepairTeam.findById(order.assignedTeamId);
      if (team) {
        if (isApproved) {
          team.status = 'AVAILABLE';
          team.activeWorkOrderId = null;
        } else {
          // If manual review is required, the team is probably blocked or still on site
          team.status = 'BLOCKED';
        }
        await team.save();
      }

      eventBus.publish(
        EVENTS.STATUS_CHANGED,
        'Complaint',
        order.complaintId._id,
        {
          workOrderId: order.workOrderId,
          status: newStatus,
          engineerStatus: newStatus,
          verificationResult: {
            confidence: confidenceScore,
            isApproved,
            reason: isApproved ? 'Visual evidence matches expected repair profile.' : 'Evidence unclear or incomplete. Manual review requested.'
          }
        },
        'AI Verification Engine',
        correlationId
      );

      console.log(`[VerificationEngine] WorkOrder ${payload.workOrderId} processed. Score: ${confidenceScore}. Status -> ${newStatus}`);

    } catch (err) {
      console.error('[VerificationEngine] Failed to process evidence:', err);
    }
  }
}

export const verificationEngine = new EvidenceVerificationEngine();
