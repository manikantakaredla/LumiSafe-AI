import { analyticsService } from '../../shared/intelligence/analyticsService.js';
import { recommendationService } from '../../shared/intelligence/recommendationService.js';
import { riskService } from '../../shared/intelligence/riskService.js';
import { corridorService } from '../../shared/intelligence/corridorService.js';

class CopilotEngine {
  /**
   * Processes a natural language query using a deterministic intent router.
   * In Phase 5, this will be replaced with Gemini AI logic.
   * @param {string} query - The user's query
   * @param {Object} context - Optional context (e.g. selected entity in Drawer)
   */
  async processQuery(query, context = {}) {
    const lowerQuery = query.toLowerCase();

    // 1. Generate Briefings
    if (lowerQuery.includes('briefing') || lowerQuery.includes('daily summary') || lowerQuery.includes('morning brief')) {
      const overview = await analyticsService.getOperationalOverview();
      const topTeams = await analyticsService.getTeamPerformance();
      
      // We return structured operational data, not conversational text
      return {
        intent: 'GENERATE_BRIEFING',
        type: 'BRIEFING_CARD',
        title: 'Daily Operations Briefing',
        data: {
          overview,
          topTeams: topTeams.slice(0, 3),
          summaryText: `System indicates ${overview.totalComplaintsToday || 0} active complaints. Overall resolution rate is stable.`
        }
      };
    }

    // 2. Explain AI Decisions / Recommendations
    if (lowerQuery.includes('explain') || lowerQuery.includes('why')) {
      // If context has an entity, explain for that entity
      if (context.entityId && context.entityType === 'Work Order') {
        return {
          intent: 'EXPLAIN_DECISION',
          type: 'EXPLANATION_CARD',
          title: `Decision Explanation for ${context.entityId}`,
          data: {
            factors: ['High Complaint Density', 'Repeated Lighting Failures'],
            confidence: '94%',
            predictedImpact: '+4.5% Safety Score'
          }
        };
      }
      
      // General explanation request
      const recs = await recommendationService.generateRecommendations();
      return {
        intent: 'EXPLAIN_DECISION',
        type: 'EXPLANATION_CARD',
        title: 'Top Operational Recommendation',
        data: {
          recommendation: recs[0] || 'No current recommendations',
          factors: ['Risk thresholds exceeded in Ward 4', 'Cascade lighting failures detected']
        }
      };
    }

    // 3. Search / Corridors
    if (lowerQuery.includes('unsafe') || lowerQuery.includes('corridor')) {
      const corridors = await corridorService.getUnsafeCorridors();
      return {
        intent: 'SEARCH_CORRIDORS',
        type: 'DATA_GRID',
        title: 'High Risk Corridors',
        data: {
          columns: ['Corridor', 'Failed Lights', 'Risk Score', 'Required Patrols'],
          rows: corridors.map(c => [
            c.name, c.failedLights, c.riskScore.toFixed(1), c.requiredPatrols
          ])
        }
      };
    }

    // Default fallback
    return {
      intent: 'UNKNOWN',
      type: 'TEXT',
      title: 'Command Not Recognized',
      data: {
        text: 'The Operational Assistant could not process this command. Please try asking for a "briefing", "unsafe corridors", or "explain decisions".'
      }
    };
  }
}

export const copilotEngine = new CopilotEngine();
