import PoliceUnit from '../../models/PoliceUnit.js';
import { eventBus } from '../../events/eventBus.js';

export const getAllUnits = async (req, res) => {
  try {
    const units = await PoliceUnit.find();
    res.json({ success: true, data: units });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateUnitState = async (req, res) => {
  try {
    const { unitId } = req.params;
    const { status, currentTask, coordinates } = req.body;
    
    const updatePayload = {};
    if (status) updatePayload.status = status;
    if (currentTask) updatePayload.currentTask = currentTask;
    if (coordinates) updatePayload.location = { type: 'Point', coordinates };

    const unit = await PoliceUnit.findOneAndUpdate(
      { unitId },
      { $set: updatePayload },
      { new: true }
    );

    if (!unit) return res.status(404).json({ success: false, error: 'Unit not found' });

    // Publish to EventBus so maps update live
    await eventBus.publish('police.status_changed', {
      entityId: unitId,
      entityType: 'PoliceUnit',
      status: unit.status,
      location: unit.location.coordinates,
      timestamp: new Date()
    });

    res.json({ success: true, data: unit });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
