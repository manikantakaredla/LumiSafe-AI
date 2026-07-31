import { eventBus, EVENTS } from '../../engine/eventbus/eventBus.js';

class NotificationService {
  init() {
    eventBus.on(EVENTS.REPORT_CREATED, this.handleNewComplaint.bind(this));
    eventBus.on(EVENTS.WORKORDER_CREATED, this.handleNewWorkOrder.bind(this));
    eventBus.on(EVENTS.VERIFICATION_COMPLETED, this.handleVerificationCompleted.bind(this));
    eventBus.on(EVENTS.VERIFICATION_MANUAL_REVIEW, this.handleManualReview.bind(this));
    eventBus.on(EVENTS.STATUS_CHANGED, this.handleStatusChanged.bind(this));
  }

  async handleNewComplaint(eventData) {
    eventBus.publish(EVENTS.NOTIFICATION_CREATED, 'User', 'role:Commissioner', {
      title: 'New Complaint',
      message: `A new complaint was reported in Ward.`,
      type: 'info'
    }, 'NotificationService', eventData.correlationId);
  }

  async handleNewWorkOrder(eventData) {
    eventBus.publish(EVENTS.NOTIFICATION_CREATED, 'User', 'role:Electrical Supervisor', {
      title: 'Work Order Auto-Generated',
      message: `AI has generated a work order for a critical fault.`,
      type: 'warning'
    }, 'NotificationService', eventData.correlationId);
  }

  async handleVerificationCompleted(eventData) {
    // Notify Commissioner, Supervisor, Citizen
    ['role:Commissioner', 'role:Electrical Supervisor', 'role:Citizen'].forEach(role => {
      eventBus.publish(EVENTS.NOTIFICATION_CREATED, 'User', role, {
        title: 'Repair Verified',
        message: `Work Order ${eventData.payload.workOrderId} has been successfully verified.`,
        type: 'success'
      }, 'NotificationService', eventData.correlationId);
    });
  }

  async handleManualReview(eventData) {
    eventBus.publish(EVENTS.NOTIFICATION_CREATED, 'User', 'role:Electrical Supervisor', {
      title: 'Manual Review Required',
      message: `Work Order ${eventData.payload.workOrderId} failed AI Verification and requires manual review.`,
      type: 'warning'
    }, 'NotificationService', eventData.correlationId);
  }

  async handleStatusChanged(eventData) {
    const { supervisorAction, workOrderId } = eventData.payload || {};
    if (!supervisorAction) return;

    if (supervisorAction === 'REQUEST_REWORK') {
      eventBus.publish(EVENTS.NOTIFICATION_CREATED, 'User', 'role:Field Engineer', {
        title: 'Rework Requested',
        message: `Supervisor has requested a rework for Work Order ${workOrderId}.`,
        type: 'error'
      }, 'NotificationService', eventData.correlationId);
    } else if (supervisorAction === 'REJECT') {
      eventBus.publish(EVENTS.NOTIFICATION_CREATED, 'User', 'role:Citizen', {
        title: 'Repair Rejected',
        message: `The repair for your complaint could not be completed and was rejected.`,
        type: 'error'
      }, 'NotificationService', eventData.correlationId);
    }
  }
}

export default new NotificationService();
