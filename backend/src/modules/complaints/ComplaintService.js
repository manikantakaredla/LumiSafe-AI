import ComplaintRepository from './ComplaintRepository.js';
import { eventBus, EVENTS } from '../../engine/eventbus/eventBus.js';

class ComplaintService {
  async submitReport(data) {
    const complaintId = `REP-${Math.floor(Math.random() * 100000)}`;
    
    const newComplaint = await ComplaintRepository.create({
      complaintId,
      category: data.category,
      description: data.description,
      location: {
        type: 'Point',
        coordinates: [data.lng, data.lat]
      }
    });

    // Fire event to Event Bus (authoritative engine)
    await eventBus.publish(EVENTS.REPORT_CREATED, 'Complaint', newComplaint._id, {
      complaintId: newComplaint.complaintId,
      category: newComplaint.category,
      lat: data.lat,
      lng: data.lng
    });

    return newComplaint;
  }
}

export default new ComplaintService();
