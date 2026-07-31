import PriorityEngine from './priority/PriorityEngine.js';
import RecommendationEngine from './recommendation/RecommendationEngine.js';
import WorkOrderService from '../modules/workorders/WorkOrderService.js';
import TimelineService from '../modules/timeline/TimelineService.js';
import NotificationService from '../modules/notifications/NotificationService.js';

export const initializeAIEngines = () => {
  console.log('[AI ENGINES] Initializing Backend Event-Driven Engines...');
  
  PriorityEngine.init();
  RecommendationEngine.init();
  WorkOrderService.init();
  TimelineService.init();
  NotificationService.init();
  
  console.log('[AI ENGINES] Subscribed to Operations Event Bus.');
};
