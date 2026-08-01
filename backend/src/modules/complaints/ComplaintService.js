import ComplaintRepository from './ComplaintRepository.js';
import { eventBus, EVENTS } from '../../engine/eventbus/eventBus.js';
import { gisEngine } from '../gis/gisEngine.js';

class ComplaintService {
  async submitReport(data, idempotencyKey, correlationId) {
    if (idempotencyKey) {
      const existing = await ComplaintRepository.model.findOne({ idempotencyKey });
      if (existing) return existing;
    }

    const complaintId = `REP-${Math.floor(Math.random() * 100000)}`;
    
    // Perform automated Point-in-Polygon GIS spatial query to identify exact Ward & nearest streetlight pole
    const gisIntelligence = await gisEngine.analyzePoint([data.lng, data.lat]);

    let descriptionWithGis = data.description || '';
    if (gisIntelligence && gisIntelligence.ward) {
      descriptionWithGis += `\n[GIS Point-in-Polygon Match: ${gisIntelligence.ward.name} (${gisIntelligence.ward.matchMethod}) | Nearest Pole: ${gisIntelligence.roadNetwork.poleId} on ${gisIntelligence.roadNetwork.roadName} (${gisIntelligence.roadNetwork.distanceMeters}m)]`;
    }

    const newComplaint = await ComplaintRepository.create({
      complaintId,
      category: data.category,
      idempotencyKey,
      description: descriptionWithGis,
      wardId: gisIntelligence?.ward?.id || null,
      nearestAssetId: gisIntelligence?.roadNetwork?.nearestAssetId || null,
      location: {
        type: 'Point',
        coordinates: [data.lng, data.lat]
      },
      timeline: [{
        status: `GIS Point-in-Polygon Mapped: ${gisIntelligence?.ward?.name || 'Visakhapatnam Sector'} (${gisIntelligence?.roadNetwork?.poleId})`,
        timestamp: new Date()
      }]
    });

    // Fire event to Event Bus (authoritative engine)
    await eventBus.publish(EVENTS.REPORT_CREATED, 'Complaint', newComplaint._id, {
      complaintId: newComplaint.complaintId,
      category: newComplaint.category,
      ward: gisIntelligence?.ward?.name,
      poleId: gisIntelligence?.roadNetwork?.poleId,
      lat: data.lat,
      lng: data.lng
    }, 'GIS Spatial Engine', correlationId);

    return newComplaint;
  }
}

export default new ComplaintService();
