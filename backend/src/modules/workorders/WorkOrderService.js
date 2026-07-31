import { eventBus, EVENTS } from '../../engine/eventbus/eventBus.js';
import { WorkOrder } from '../../models/WorkOrder.js';

class WorkOrderService {
  init() {
    eventBus.on(EVENTS.WORKORDER_CREATED, this.handleWorkOrderCreated.bind(this));
  }

  async handleWorkOrderCreated(eventData) {
    const { entityId, payload, correlationId } = eventData;
    
    // Create the actual work order
    const workOrderId = `WO-${Math.floor(Math.random() * 100000)}`;
    const workOrder = await WorkOrder.create({
      workOrderId,
      complaintId: entityId,
      status: 'Pending',
      priority: 'High',
      requiredMaterials: payload.inventory || [],
      assignedToTeam: 'Auto Dispatch'
    });

    // We can emit a specific workorder.created event if we want, but the RecommendationEngine already emitted it.
    // Instead, this service simply persists it to the DB so the Electrical Dashboard can fetch it.
    console.log(`[WorkOrderService] Persisted WorkOrder ${workOrderId} for Complaint ${entityId}`);
  }
}

export default new WorkOrderService();
