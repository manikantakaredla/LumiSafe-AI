import { EventEmitter } from 'events';
import { EventLog } from '../../models/EventLog.js';
import { broadcastEvent } from '../../sockets/socketGateway.js';

class OperationsEventBus extends EventEmitter {
  async publish(eventType, entityModel, entityId, payload, triggeredBy = 'System', correlationId = null) {
    console.log(`[EVENT BUS] ⚡ ${eventType} -> ${entityModel}:${entityId} [Correlation: ${correlationId}]`);
    
    try {
      // 1. Persist to MongoDB
      await EventLog.create({
        eventType,
        entityModel,
        entityId,
        payload,
        triggeredBy,
        correlationId
      });

      // 2. Emit native Node event for AI Engines to catch asynchronously
      this.emit(eventType, { entityId, entityModel, payload, triggeredBy, correlationId });

      // 3. Broadcast to WebSockets (React Clients) using domain-specific topics
      const topicMap = {
        'REPORT_CREATED': 'complaint.created',
        'REPORT_CLASSIFIED': 'complaint.updated',
        'WORKORDER_CREATED': 'workorder.created',
        'WORKORDER_ASSIGNED': 'workorder.updated',
        'EVIDENCE_UPLOADED': 'evidence.uploaded',
        'GPS_VERIFIED': 'verification.completed',
        'NOTIFICATION_CREATED': 'notification.created',
        'STATUS_CHANGED': 'timeline.updated'
      };
      
      const topic = topicMap[eventType] || 'system.event';
      broadcastEvent(topic, { eventType, entityModel, entityId, payload });
      
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
