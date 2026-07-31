/**
 * Recommendation Service
 * Generates transparent AI recommendations and explainable decisions.
 */
class RecommendationService {
  generatePatrolRecommendation(corridorRisk, nearestUnit, womenSafetyRisk) {
    let recommendation = '';
    let confidence = 0;
    let expectedImpact = '';

    if (womenSafetyRisk > 75) {
      recommendation = `Immediately dispatch ${nearestUnit.name} to establish visible presence.`;
      confidence = 94;
      expectedImpact = 'High (Prevents opportunistic crime in dark zone)';
    } else if (corridorRisk > 50) {
      recommendation = `Reroute ${nearestUnit.name} for periodic sweeping of the corridor.`;
      confidence = 82;
      expectedImpact = 'Medium (Deters antisocial behavior)';
    } else {
      recommendation = `Monitor via CCTV. No immediate dispatch required.`;
      confidence = 70;
      expectedImpact = 'Low (Area is stable)';
    }

    return {
      action: recommendation,
      confidence,
      expectedImpact,
      reasons: [
        `Women Safety Risk at ${Math.round(womenSafetyRisk)}%`,
        `Corridor Risk at ${Math.round(corridorRisk)}%`,
        `${nearestUnit.name} is nearest available unit`
      ]
    };
  }
}

export const recommendationService = new RecommendationService();
