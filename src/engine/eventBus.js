class EventBus {
  constructor() {
    this.listeners = {}
  }
  
  subscribe(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = []
    this.listeners[event].push(callback)
  }
  
  publish(event, payload) {
    console.log(`[EVENT BUS] ⚡ ${event}`, payload)
    if (this.listeners[event]) {
      // Use setTimeout to simulate async decoupled processing
      this.listeners[event].forEach(callback => {
        setTimeout(() => {
          try {
            callback(payload)
          } catch (err) {
            console.error(`[EVENT BUS] Error in ${event}:`, err)
          }
        }, 10)
      })
    }
  }
}

export const eventBus = new EventBus()

export const EVENTS = {
  REPORT_CREATED: 'REPORT_CREATED',
  
  // Engine Outputs
  PRIORITY_CALCULATED: 'PRIORITY_CALCULATED',
  WARD_IDENTIFIED: 'WARD_IDENTIFIED',
  SAFETY_IMPACT_CALCULATED: 'SAFETY_IMPACT_CALCULATED',
  RESOURCE_RECOMMENDED: 'RESOURCE_RECOMMENDED',
  RECOMMENDATION_GENERATED: 'RECOMMENDATION_GENERATED',
  
  // Operational Events
  WORK_ORDER_CREATED: 'WORK_ORDER_CREATED',
  
  // Field Operations Events
  TASK_ACCEPTED: 'TASK_ACCEPTED',
  NAV_STARTED: 'NAV_STARTED',
  ARRIVED_ONSITE: 'ARRIVED_ONSITE',
  REPAIR_STARTED: 'REPAIR_STARTED',
  EVIDENCE_UPLOADED: 'EVIDENCE_UPLOADED',
  GPS_VERIFIED: 'GPS_VERIFIED',
  REPAIR_CONFIDENCE_SCORED: 'REPAIR_CONFIDENCE_SCORED',
  WORK_COMPLETED: 'WORK_COMPLETED',
  REPORT_RESOLVED: 'REPORT_RESOLVED',
  ESCALATION_TRIGGERED: 'ESCALATION_TRIGGERED',

  STATUS_CHANGED: 'STATUS_CHANGED',
  TIMELINE_UPDATED: 'TIMELINE_UPDATED',
  NOTIFICATION_GENERATED: 'NOTIFICATION_GENERATED',
  GIS_UPDATED: 'GIS_UPDATED',
  
  // UI Sync
  SYNC_DASHBOARD: 'SYNC_DASHBOARD'
}
