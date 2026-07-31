import { eventBus, EVENTS } from './eventBus'

class WardIntelligence {
  init() {
    eventBus.subscribe(EVENTS.REPORT_CREATED, this.identifyWard)
  }

  identifyWard = (payload) => {
    const { report } = payload
    
    // Deterministic mock mapping based on coordinates
    let ward = 'Ward 4'
    let nearestAsset = 'SL-8842'
    let electricalSection = 'Zone B Electrical'

    if (report.lat > 17.72) {
      ward = 'Ward 11'
      nearestAsset = 'SL-9910'
      electricalSection = 'Zone A Electrical'
    }

    setTimeout(() => {
      eventBus.publish(EVENTS.WARD_IDENTIFIED, { 
        reportId: report.id, 
        ward,
        nearestAsset,
        electricalSection
      })
    }, 800)
  }
}
export const wardIntelligence = new WardIntelligence()
