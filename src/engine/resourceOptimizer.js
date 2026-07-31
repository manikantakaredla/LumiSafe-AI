import { eventBus, EVENTS } from './eventBus'

class ResourceOptimizer {
  init() {
    eventBus.subscribe(EVENTS.WARD_IDENTIFIED, this.recommendResource)
  }

  recommendResource = (payload) => {
    const { reportId, electricalSection } = payload
    
    let team = 'Alpha Team'
    let vehicle = 'Truck AP-31-442'
    let budget = '₹ 15,000'
    let estimatedTime = '2 Hours'

    if (electricalSection && electricalSection.includes('Zone A')) {
      team = 'Beta Team'
      budget = '₹ 22,000'
      estimatedTime = '4 Hours'
    }

    setTimeout(() => {
      eventBus.publish(EVENTS.RESOURCE_RECOMMENDED, { 
        reportId, 
        team,
        vehicle,
        budget,
        estimatedTime
      })
    }, 1000)
  }
}
export const resourceOptimizer = new ResourceOptimizer()
