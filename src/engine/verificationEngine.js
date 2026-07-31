import { eventBus, EVENTS } from './eventBus'

class VerificationEngine {
  init() {
    eventBus.subscribe(EVENTS.EVIDENCE_UPLOADED, this.verifyEvidence)
  }

  verifyEvidence = (payload) => {
    const { reportId, evidence } = payload
    
    // Simulate AI processing delay
    setTimeout(() => {
      let score = 0
      const checks = {
        gpsMatch: false,
        timestampValid: false,
        photoPresence: false,
        inventoryRecorded: true // Mocked as true for this demo
      }

      // Deterministic Scoring
      if (evidence.gps) {
        checks.gpsMatch = true
        score += 35
      }
      
      if (evidence.timestamp) {
        checks.timestampValid = true
        score += 15
      }

      if (evidence.afterPhoto) {
        checks.photoPresence = true
        score += 40
      }
      
      if (checks.inventoryRecorded) {
        score += 10
      }

      const details = {
        checks,
        beforePhoto: evidence.beforePhoto,
        afterPhoto: evidence.afterPhoto
      }

      eventBus.publish(EVENTS.REPAIR_CONFIDENCE_SCORED, { reportId, score, details })

      // Decision Gate
      if (score >= 85) {
        eventBus.publish(EVENTS.GPS_VERIFIED, { reportId })
        // Simulate minor delay before closing
        setTimeout(() => {
          eventBus.publish(EVENTS.REPORT_RESOLVED, { reportId })
        }, 500)
      } else {
        eventBus.publish(EVENTS.MANUAL_REVIEW_REQUIRED, { reportId, score })
      }
    }, 1500)
  }
}

export const verificationEngine = new VerificationEngine()
