import logger from './logger.js';

class SchedulerService {
  constructor() {
    this.tasks = new Map();
  }

  // Register a recurring job
  registerCron(taskName, cronExpression, handler) {
    logger.info(`[SchedulerService] Registered Cron Task: ${taskName} (${cronExpression})`);
    
    // In production, this would use node-cron or Agenda
    this.tasks.set(taskName, {
      cronExpression,
      handler,
      status: 'Registered'
    });
  }
}

export default new SchedulerService();
