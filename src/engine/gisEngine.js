import { eventBus, EVENTS } from './eventBus'

class GisEngine {
  init() {
    eventBus.subscribe(EVENTS.REPORT_CREATED, this.updateMap)
  }

  updateMap = (payload) => {
    const { report } = payload
    
    // Transform a citizen report into a GIS entity
    const mapEntity = {
      id: report.id,
      title: report.category,
      lat: report.lat,
      lng: report.lng,
      type: 'Complaint',
      priority: 'high' // Will be synced later
    }
    
    eventBus.publish(EVENTS.GIS_UPDATED, { mapEntity })
  }
}
export const gisEngine = new GisEngine()
