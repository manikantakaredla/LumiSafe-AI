/**
 * Risk Service
 * Evaluates operational and safety risks (e.g. Women Safety Risk) based on 
 * overlapping factors like complaint density and electrical failures.
 */
class RiskService {
  calculateWomenSafetyRisk(complaints, failedLights) {
    // Mock algorithm: (failedLights * 0.6) + (complaints * 0.4)
    let score = (failedLights * 12) + (complaints * 8);
    return Math.min(score, 100); // Max 100
  }

  evaluateCorridorRisk(length, failedLights, complaintDensity) {
    // Risk factors based on dark corridor length and failures
    const baseRisk = (length / 1000) * 10; // 10 points per km
    const lightRisk = failedLights * 5;
    const densityRisk = complaintDensity * 15;
    return Math.min(baseRisk + lightRisk + densityRisk, 100);
  }
}

export const riskService = new RiskService();
