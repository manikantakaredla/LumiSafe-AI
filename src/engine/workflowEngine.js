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
    eventBus.subscribe(EVENTS.REPORT_RESOLVED, (p) => {
      this.updateStatus(p.reportId, 'Issue Resolved')
    })

    eventBus.subscribe(EVENTS.MANUAL_REVIEW_REQUIRED, (p) => {
      this.updateStatus(p.reportId, 'Needs Review')
    })
  }

  updateStatus = (reportId, newStatus) => {
    eventBus.publish(EVENTS.STATUS_CHANGED, { reportId, status: newStatus })
  }
}
export const workflowEngine = new WorkflowEngine()
