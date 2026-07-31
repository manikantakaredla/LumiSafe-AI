import EvidenceRepository from './EvidenceRepository.js';
import StorageService from '../../shared/StorageService.js';
import { eventBus, EVENTS } from '../../engine/eventbus/eventBus.js';
import { WorkOrder } from '../../models/WorkOrder.js';

class EvidenceService {
  async uploadEvidence(workOrderId, uploaderId, file, location) {
    const uploadResult = await StorageService.upload(file);
    
    const evidence = await EvidenceRepository.create({
      workOrderId,
      uploadedBy: uploaderId,
      afterPhotoUrl: uploadResult.url,
      gpsLocation: location ? { type: 'Point', coordinates: [location.lng, location.lat] } : null,
      status: 'Pending'
    });

    // Link to WorkOrder
    await WorkOrder.findByIdAndUpdate(workOrderId, { evidenceId: evidence._id, status: 'Verifying Evidence' });

    // Publish event for Verification Engine
    await eventBus.publish(EVENTS.EVIDENCE_UPLOADED, 'Evidence', evidence._id, {
      workOrderId,
      evidenceId: evidence._id,
      afterPhotoUrl: evidence.afterPhotoUrl,
      lat: location?.lat,
      lng: location?.lng
    });

    return evidence;
  }
}

export default new EvidenceService();
