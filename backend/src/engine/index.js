import PriorityEngine from './priority/PriorityEngine.js';
import RecommendationEngine from './recommendation/RecommendationEngine.js';

export const initializeAIEngines = () => {
  console.log('[AI ENGINES] Initializing Backend Event-Driven Engines...');
  
  PriorityEngine.init();
  RecommendationEngine.init();
  
  console.log('[AI ENGINES] Subscribed to Operations Event Bus.');
};
