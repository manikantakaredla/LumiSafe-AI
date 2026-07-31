import logger from './logger.js';

class MetricsService {
  constructor() {
    this.metrics = {
      complaintsCreatedToday: 0,
      verificationSuccessCount: 0,
      verificationFailedCount: 0,
      apiRequestsTotal: 0,
      socketConnectionsActive: 0
    };
  }

  increment(metricName, value = 1) {
    if (this.metrics[metricName] !== undefined) {
      this.metrics[metricName] += value;
    }
  }

  set(metricName, value) {
    this.metrics[metricName] = value;
  }

  getMetrics() {
    return this.metrics;
  }
}

export default new MetricsService();
