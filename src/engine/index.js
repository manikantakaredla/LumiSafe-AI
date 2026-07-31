import { priorityEngine } from './priorityEngine'
import { wardIntelligence } from './wardIntelligence'
import { safetyEngine } from './safetyEngine'
import { resourceOptimizer } from './resourceOptimizer'
import { recommendationEngine } from './recommendationEngine'
import { workflowEngine } from './workflowEngine'
import { timelineEngine } from './timelineEngine'
import { notificationEngine } from './notificationEngine'
import { gisEngine } from './gisEngine'
import { dashboardSyncEngine } from './dashboardSyncEngine'

export function initializeAIEngine() {
  console.log('[AI ENGINE] Initializing Event-Driven Operations Engine...')
  
  priorityEngine.init()
  wardIntelligence.init()
  safetyEngine.init()
  resourceOptimizer.init()
  recommendationEngine.init()
  workflowEngine.init()
  timelineEngine.init()
  notificationEngine.init()
  gisEngine.init()
  dashboardSyncEngine.init()
  
  console.log('[AI ENGINE] All modules subscribed to Operations Event Bus.')
}
