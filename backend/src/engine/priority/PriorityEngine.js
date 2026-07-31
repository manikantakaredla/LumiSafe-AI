import { eventBus, EVENTS } from '../eventbus/eventBus.js';
import ComplaintRepository from '../../modules/complaints/ComplaintRepository.js';

class PriorityEngine {
  init() {
    eventBus.on(EVENTS.REPORT_CREATED, this.calculatePriority.bind(this));
  }

  async calculatePriority(eventData) {
    const { entityId, payload, correlationId } = eventData;
    let priority = 'Low';
    
    const cat = (payload.category || '').toLowerCase();
    if (cat.includes('dark')) priority = 'High';
    else if (cat.includes('pole')) priority = 'Critical';
    else if (cat.includes('broken')) priority = 'Medium';
    else priority = 'High';

    try {
      // Simulate slight AI processing delay
      await new Promise(r => setTimeout(r, 500));
      
      // Update DB
      await ComplaintRepository.updateById(entityId, { priority, status: 'AI Classified & Prioritized' });
      
      // Emit next event
      await eventBus.publish(EVENTS.REPORT_CLASSIFIED, 'Complaint', entityId, { priority }, 'PriorityEngine', correlationId);
      
    } catch (err) {
      console.error('[PriorityEngine] Error:', err);
    }
  }
}

export default new PriorityEngine();
