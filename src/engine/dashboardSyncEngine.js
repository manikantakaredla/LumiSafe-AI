import { eventBus, EVENTS } from './eventBus'
import { useAppStore } from '@/store/useAppStore'

class DashboardSyncEngine {
  init() {
    // Bridges event bus payloads to Zustand mutations
    
    eventBus.subscribe(EVENTS.REPORT_CREATED, (p) => {
      // Create initial report in the store
      useAppStore.getState().initPublicReport(p.report)
    })

    eventBus.subscribe(EVENTS.GIS_UPDATED, (p) => {
      // Maps already read from publicReports now, but we could add to a GIS specific store
    })
    
    eventBus.subscribe(EVENTS.TIMELINE_UPDATED, (p) => {
      useAppStore.getState().updateReportTimeline(p.reportId, p.timelineEvent)
    })

    eventBus.subscribe(EVENTS.NOTIFICATION_GENERATED, (p) => {
      useAppStore.getState().addNotification(p)
    })
    
    eventBus.subscribe(EVENTS.RECOMMENDATION_GENERATED, (p) => {
      useAppStore.getState().updateReportState(p.reportId, { aiExplanation: p.explanation })
    })

    eventBus.subscribe(EVENTS.RESOURCE_RECOMMENDED, (p) => {
      useAppStore.getState().updateReportState(p.reportId, { 
        assignedTeam: p.team,
        estimatedTime: p.estimatedTime,
        budget: p.budget
      })
    })

    eventBus.subscribe(EVENTS.SAFETY_IMPACT_CALCULATED, (p) => {
      useAppStore.getState().updateReportState(p.reportId, { safetyImprovement: p.safetyImprovement })
    })

    eventBus.subscribe(EVENTS.PRIORITY_CALCULATED, (p) => {
      useAppStore.getState().updateReportState(p.reportId, { priority: p.priority })
    })

    eventBus.subscribe(EVENTS.WARD_IDENTIFIED, (p) => {
      useAppStore.getState().updateReportState(p.reportId, { 
        ward: p.ward,
        nearestAsset: p.nearestAsset,
        electricalSection: p.electricalSection
      })
    })
    
    eventBus.subscribe(EVENTS.STATUS_CHANGED, (p) => {
      useAppStore.getState().updateReportState(p.reportId, { status: p.status })
    })

    // Field Operations Sync
    eventBus.subscribe(EVENTS.WORK_ORDER_CREATED, (p) => {
      useAppStore.getState().updateReportState(p.reportId, { 
        workOrderId: `WO-${Math.floor(Math.random() * 10000)}`,
        inventory: p.inventory || ['LED Lamp (120W)', 'Waterproof Seal', 'Standard Cable (2m) भी']
      })
    })

    eventBus.subscribe(EVENTS.EVIDENCE_UPLOADED, (p) => {
      useAppStore.getState().updateReportState(p.reportId, { 
        evidence: p.evidence,
        engineerStatus: 'Verifying Evidence'
      })
    })

    eventBus.subscribe(EVENTS.REPAIR_CONFIDENCE_SCORED, (p) => {
      useAppStore.getState().updateReportState(p.reportId, { 
        confidenceScore: p.score,
        verificationDetails: p.details
      })
    })

    eventBus.subscribe(EVENTS.TASK_ACCEPTED, (p) => {
      useAppStore.getState().updateReportState(p.reportId, { engineerStatus: 'Task Accepted' })
    })

    eventBus.subscribe(EVENTS.NAV_STARTED, (p) => {
      useAppStore.getState().updateReportState(p.reportId, { engineerStatus: 'En Route' })
    })

    eventBus.subscribe(EVENTS.ARRIVED_ONSITE, (p) => {
      useAppStore.getState().updateReportState(p.reportId, { engineerStatus: 'Arrived On Site' })
    })

    eventBus.subscribe(EVENTS.REPAIR_STARTED, (p) => {
      useAppStore.getState().updateReportState(p.reportId, { engineerStatus: 'Repairing' })
    })
  }
}
export const dashboardSyncEngine = new DashboardSyncEngine()
