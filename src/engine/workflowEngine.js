import { eventBus, EVENTS } from './eventBus'

class WorkflowEngine {
  init() {
    eventBus.subscribe(EVENTS.REPORT_CREATED, (p) => {
      this.updateStatus(p.report.id, 'Report Submitted')
    })
    
    eventBus.subscribe(EVENTS.PRIORITY_CALCULATED, (p) => {
      this.updateStatus(p.reportId, 'AI Classified & Prioritized')
    })

    eventBus.subscribe(EVENTS.RECOMMENDATION_GENERATED, (p) => {
      this.updateStatus(p.reportId, 'Assigned to Electrical Dept')
      
      // Also generate work order
      eventBus.publish(EVENTS.WORK_ORDER_CREATED, { 
        reportId: p.reportId,
        inventory: ['LED Lamp (120W)', 'Waterproof Seal', 'Standard Cable (2m)']
      })
    })

    // Field Ops Workflow
    eventBus.subscribe(EVENTS.EVIDENCE_UPLOADED, (p) => {
      // Simulate autonomous verification
      setTimeout(() => {
        const score = 96
        const details = { gpsMatch: true, timestampValid: true, photoQuality: 'Optimal' }
        
        eventBus.publish(EVENTS.REPAIR_CONFIDENCE_SCORED, { reportId: p.reportId, score, details })
        eventBus.publish(EVENTS.GPS_VERIFIED, { reportId: p.reportId })
        
        setTimeout(() => {
          eventBus.publish(EVENTS.REPORT_RESOLVED, { reportId: p.reportId })
          this.updateStatus(p.reportId, 'Issue Resolved')
        }, 1000)
      }, 1500)
    })
  }

  updateStatus = (reportId, newStatus) => {
    eventBus.publish(EVENTS.STATUS_CHANGED, { reportId, status: newStatus })
  }
}
export const workflowEngine = new WorkflowEngine()
