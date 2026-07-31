import { eventBus, EVENTS } from './eventBus'

class RecommendationEngine {
  init() {
    eventBus.subscribe(EVENTS.RESOURCE_RECOMMENDED, this.generateExplanation)
  }

  generateExplanation = (payload) => {
    const { reportId, team, estimatedTime } = payload
    
    const explanation = {
      reason: `Historical data indicates similar faults in this zone require ${team} intervention to prevent cascading failures.`,
      confidence: '94%',
      rulesApplied: ['Proximity Rule', 'Load Balancing Rule'],
      expectedImpact: `Restores standard safety index within ${estimatedTime}.`,
    }

    setTimeout(() => {
      eventBus.publish(EVENTS.RECOMMENDATION_GENERATED, { 
        reportId, 
        explanation 
      })
    }, 600)
  }
}
export const recommendationEngine = new RecommendationEngine()
