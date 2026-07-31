import { eventBus, EVENTS } from '../eventbus/eventBus.js';
import { Recommendation } from '../../models/Recommendation.js';
import ComplaintRepository from '../../modules/complaints/ComplaintRepository.js';

class RecommendationEngine {
  init() {
    eventBus.on(EVENTS.REPORT_CLASSIFIED, this.generateRecommendation.bind(this));
  }

  async generateRecommendation(eventData) {
    const { entityId, payload, correlationId } = eventData;
    
    try {
      await new Promise(r => setTimeout(r, 600));

      const reason = `Historical data indicates similar faults require intervention to prevent cascading failures. Priority marked as ${payload.priority}.`;
      
      const rec = await Recommendation.create({
        reportId: entityId,
        reason,
        confidence: '94%',
        rulesApplied: ['Proximity Rule', 'Load Balancing Rule'],
        expectedImpact: 'Restores standard safety index'
      });

      await ComplaintRepository.updateById(entityId, { 
        aiExplanation: rec._id, 
        status: 'Assigned to Electrical Dept' 
      });

      await eventBus.publish(EVENTS.RECOMMENDATION_GENERATED, 'Complaint', entityId, { recommendationId: rec._id }, 'RecommendationEngine', correlationId);
      
      // For this workflow, also immediately generate a Work Order
      await eventBus.publish(EVENTS.WORKORDER_CREATED, 'Complaint', entityId, { inventory: ['LED Lamp (120W)', 'Waterproof Seal'] }, 'WorkflowEngine', correlationId);

    } catch (err) {
      console.error('[RecommendationEngine] Error:', err);
    }
  }
}

export default new RecommendationEngine();
