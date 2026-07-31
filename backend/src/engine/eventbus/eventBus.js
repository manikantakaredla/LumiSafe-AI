import { EventEmitter } from 'events';
import { EventLog } from '../../models/EventLog.js';
import { broadcastEvent } from '../../sockets/socketGateway.js';

class OperationsEventBus extends EventEmitter {
  async publish(eventType, entityModel, entityId, payload, triggeredBy = 'System') {
    console.log(`[EVENT BUS] ⚡ ${eventType} -> ${entityModel}:${entityId}`);
    
    try {
      // 1. Persist to MongoDB
      await EventLog.create({
        eventType,
        entityModel,
        entityId,
        payload,
        triggeredBy
      });

      // 2. Emit native Node event for AI Engines to catch asynchronously
      this.emit(eventType, { entityId, entityModel, payload, triggeredBy });

      // 3. Broadcast to WebSockets (React Clients)
      broadcastEvent('SYNC_STATE', { eventType, entityModel, entityId, payload });
      
    } catch (err) {
      console.error(`[EVENT BUS] Failed to publish ${eventType}:`, err);
    }
  }
}

export const eventBus = new OperationsEventBus();

export const EVENTS = {
  REPORT_CREATED: 'REPORT_CREATED',
  REPORT_CLASSIFIED: 'REPORT_CLASSIFIED',
  WORKORDER_CREATED: 'WORKORDER_CREATED',
  RECOMMENDATION_GENERATED: 'RECOMMENDATION_GENERATED',
  WORKORDER_ASSIGNED: 'WORKORDER_ASSIGNED',
  ENGINEER_STARTED: 'ENGINEER_STARTED',
  EVIDENCE_UPLOADED: 'EVIDENCE_UPLOADED',
  GPS_VERIFIED: 'GPS_VERIFIED',
  REPORT_RESOLVED: 'REPORT_RESOLVED',
  NOTIFICATION_CREATED: 'NOTIFICATION_CREATED',
  GIS_UPDATED: 'GIS_UPDATED',
  STATUS_CHANGED: 'STATUS_CHANGED'
};
