import { eventBus, EVENTS } from './eventBus'

class PriorityEngine {
  init() {
    eventBus.subscribe(EVENTS.REPORT_CREATED, this.calculatePriority)
  }

  calculatePriority = (payload) => {
    const { report } = payload
    let priority = 'Low'
    
    // Mock operational rules based on category string
    const cat = (report.category || '').toLowerCase()
    if (cat.includes('dark')) priority = 'High'
    else if (cat.includes('pole')) priority = 'Critical'
    else if (cat.includes('broken')) priority = 'Medium'
    else priority = 'High' // Default for others
    
    // Delay to simulate AI processing
    setTimeout(() => {
      eventBus.publish(EVENTS.PRIORITY_CALCULATED, { reportId: report.id, priority })
    }, 500)
  }
}
export const priorityEngine = new PriorityEngine()
