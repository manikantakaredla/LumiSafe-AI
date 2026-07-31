import { eventBus, EVENTS } from '../../engine/eventbus/eventBus.js';

class NotificationService {
  init() {
    eventBus.on(EVENTS.REPORT_CREATED, this.handleNewComplaint.bind(this));
    eventBus.on(EVENTS.WORKORDER_CREATED, this.handleNewWorkOrder.bind(this));
  }

  async handleNewComplaint(eventData) {
    // Notify Commissioner
    eventBus.publish(EVENTS.NOTIFICATION_CREATED, 'User', 'role:Commissioner', {
      title: 'New Complaint',
      message: `A new complaint was reported in Ward.`,
      type: 'info'
    }, 'NotificationService', eventData.correlationId);
  }

  async handleNewWorkOrder(eventData) {
    // Notify Electrical Supervisor
    eventBus.publish(EVENTS.NOTIFICATION_CREATED, 'User', 'role:Electrical Supervisor', {
      title: 'Work Order Auto-Generated',
      message: `AI has generated a work order for a critical fault.`,
      type: 'warning'
    }, 'NotificationService', eventData.correlationId);
  }
}

export default new NotificationService();
