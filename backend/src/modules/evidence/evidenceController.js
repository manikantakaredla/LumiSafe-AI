import { WorkOrder } from '../../models/WorkOrder.js';
import { eventBus, EVENTS } from '../../engine/eventbus/eventBus.js';
import { v4 as uuidv4 } from 'uuid';

export const uploadEvidence = async (req, res, next) => {
  try {
    const { workOrderId, beforePhoto, afterPhoto, lat, lng } = req.body;

    if (!workOrderId) {
      return res.status(400).json({ success: false, message: 'Work Order ID required' });
    }

    const order = await WorkOrder.findOne({ workOrderId }).populate('complaintId');
    if (!order) return res.status(404).json({ success: false, message: 'Work Order not found' });

    // Transition to VERIFYING (as requested by user)
    order.status = 'VERIFYING';
    
    // Store evidence temporarily on the work order or an Evidence model (keeping it simple for now)
    // We'll pass it to the Event Bus so the Verification Engine can pick it up.
    await order.save();

    const correlationId = uuidv4();

    // Fire EVIDENCE_UPLOADED
    eventBus.publish(
      EVENTS.EVIDENCE_UPLOADED,
      'Complaint',
      order.complaintId._id,
      {
        workOrderId: order.workOrderId,
        beforePhoto,
        afterPhoto,
        lat,
        lng,
        status: 'VERIFYING'
      },
      req.user ? `user:${req.user._id}` : 'Field Engineer',
      correlationId
    );

    // Also fire a status change explicitly just in case for generic listeners
    eventBus.publish(
      EVENTS.STATUS_CHANGED,
      'Complaint',
      order.complaintId._id,
      {
        workOrderId: order.workOrderId,
        status: 'VERIFYING',
        engineerStatus: 'VERIFYING'
      },
      req.user ? `user:${req.user._id}` : 'Field Engineer',
      correlationId
    );

    res.status(200).json({
      success: true,
      message: 'Evidence uploaded, verification pending',
      data: { workOrderId, status: 'VERIFYING' }
    });

  } catch (err) {
    next(err);
  }
};
