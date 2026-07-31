import { eventBus, EVENTS } from './eventBus'

class SafetyEngine {
  init() {
    eventBus.subscribe(EVENTS.PRIORITY_CALCULATED, this.calculateImpact)
  }

  calculateImpact = (payload) => {
    const { reportId, priority } = payload
    let improvement = '+1.2%'

    if (priority === 'Critical') improvement = '+5.8%'
    if (priority === 'High') improvement = '+3.4%'
    if (priority === 'Medium') improvement = '+2.1%'

    setTimeout(() => {
      eventBus.publish(EVENTS.SAFETY_IMPACT_CALCULATED, { 
        reportId, 
        safetyImprovement: improvement 
      })
    }, 400)
  }
}
export const safetyEngine = new SafetyEngine()
