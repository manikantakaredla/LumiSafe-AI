import { eventBus, EVENTS } from './eventBus'

class NotificationEngine {
  init() {
    eventBus.subscribe(EVENTS.WORK_ORDER_CREATED, this.notifyWorkOrder)
  }

  notifyWorkOrder = (payload) => {
    const { reportId } = payload
    
    eventBus.publish(EVENTS.NOTIFICATION_GENERATED, { 
      id: Math.random(),
      title: 'AI Dispatch',
      message: `Work Order automatically generated for Report ${reportId}.`,
      time: 'Just now',
      read: false
    })
  }
}
export const notificationEngine = new NotificationEngine()
