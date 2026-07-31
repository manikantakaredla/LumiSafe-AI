import { eventBus, EVENTS } from './eventBus'

class TimelineEngine {
  init() {
    eventBus.subscribe(EVENTS.STATUS_CHANGED, this.recordTimeline)
  }

  recordTimeline = (payload) => {
    const { reportId, status } = payload
    
    // Add detail mapping based on status
    let detail = undefined
    if (status === 'AI Classified & Prioritized') detail = 'Identified as High Priority in Ward 4.'
    if (status === 'Assigned to Electrical Dept') detail = 'Alpha Team notified via Operations Platform.'

    eventBus.publish(EVENTS.TIMELINE_UPDATED, { 
      reportId, 
      timelineEvent: {
        label: status,
        detail,
        time: new Date().toLocaleTimeString(),
        completed: true
      }
    })
  }
}
export const timelineEngine = new TimelineEngine()
