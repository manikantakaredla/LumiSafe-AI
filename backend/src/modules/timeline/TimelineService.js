import { eventBus, EVENTS } from '../../engine/eventbus/eventBus.js';

class TimelineService {
  init() {
    // Listen to major events and broadcast timeline updates
    eventBus.on(EVENTS.REPORT_CREATED, (e) => this.addEntry(e, 'Report Submitted'));
    eventBus.on(EVENTS.REPORT_CLASSIFIED, (e) => this.addEntry(e, 'AI Classified & Prioritized'));
    eventBus.on(EVENTS.WORKORDER_CREATED, (e) => this.addEntry(e, 'Work Order Generated'));
    eventBus.on(EVENTS.WORKORDER_ASSIGNED, (e) => this.addEntry(e, 'Engineer Assigned'));
    eventBus.on(EVENTS.EVIDENCE_UPLOADED, (e) => this.addEntry(e, 'Evidence Uploaded'));
    eventBus.on(EVENTS.GPS_VERIFIED, (e) => this.addEntry(e, 'GPS & Image Verified'));
    eventBus.on(EVENTS.REPORT_RESOLVED, (e) => this.addEntry(e, 'Report Resolved'));
  }

  async addEntry(eventData, statusLabel) {
    // Broadcast timeline.updated so the frontend instantly appends to the UI
    eventBus.publish(EVENTS.STATUS_CHANGED, eventData.entityModel, eventData.entityId, { status: statusLabel }, 'TimelineService', eventData.correlationId);
  }
}

export default new TimelineService();
