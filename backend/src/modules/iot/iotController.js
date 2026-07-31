import { StreetLight } from '../../models/StreetLight.js';
import { eventBus, EVENTS } from '../../engine/eventbus/eventBus.js';

export const getTelemetry = async (req, res, next) => {
  try {
    const lights = await StreetLight.find().populate('wardId');
    res.status(200).json({ success: true, data: lights });
  } catch (err) {
    next(err);
  }
};

export const reportFailure = async (req, res, next) => {
  try {
    const { assetId, reason, powerConsumption, voltage } = req.body;
    
    const light = await StreetLight.findOne({ assetId });
    if (!light) return res.status(404).json({ success: false, message: 'Light not found' });
    
    light.status = 'Defective';
    light.telemetry = { powerConsumption, voltage, lastUpdated: new Date() };
    await light.save();
    
    // Automatically generate a Complaint
    const { Complaint } = await import('../../models/Complaint.js');
    const complaintId = `IOT-CMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const complaint = await Complaint.create({
      complaintId,
      category: reason || 'Light Not Working',
      description: `IoT Auto-Report: ${reason}`,
      location: light.location,
      status: 'AI Classified & Prioritized',
      priority: 'High',
      wardId: light.wardId,
      nearestAssetId: light._id
    });
    
    eventBus.publish(
      EVENTS.REPORT_CREATED,
      'Complaint',
      complaint._id,
      {
        complaintId: complaint.complaintId,
        category: complaint.category,
        lat: light.location.coordinates[1],
        lng: light.location.coordinates[0],
        source: 'IoT Controller'
      },
      'IoT System'
    );
    
    res.status(200).json({ success: true, data: { light, complaint } });
  } catch (err) {
    next(err);
  }
};
