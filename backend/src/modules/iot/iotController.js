import { StreetLight } from '../../models/StreetLight.js';
import { eventBus, EVENTS } from '../../engine/eventbus/eventBus.js';

export const getTelemetry = async (req, res, next) => {
  try {
    const { status, zone, wardId } = req.query;
    const query = {};
    if (status) query.status = status;
    if (zone) query.zone = zone;
    if (wardId) query.wardId = wardId;

    const lights = await StreetLight.find(query).populate('wardId');
    res.status(200).json({ success: true, count: lights.length, data: lights });
  } catch (err) {
    next(err);
  }
};

/**
 * Specialized IoT Failure & Voltage Anomaly Monitor
 * Lists defective/OFF streetlights, their exact road names, reasons for failure, voltage dips, and 0-watt consumption.
 */
export const getFailures = async (req, res, next) => {
  try {
    const defectiveLights = await StreetLight.find({
      $or: [
        { status: { $in: ['Failed', 'Defective', 'OFF', 'Maintenance'] } },
        { 'telemetry.powerConsumption': { $lt: 10 } }, // Sudden less power consumption / 0W
        { 'telemetry.isLampDefective': true }
      ]
    }).populate('wardId');

    const failureSummary = defectiveLights.map(l => ({
      poleId: l.assetId,
      roadName: l.roadName || 'Main Feeder Road',
      zone: l.zone || 'East Zone',
      ward: l.wardId ? l.wardId.name : 'Ward Assigned',
      coordinates: l.location.coordinates,
      status: l.status,
      failureReason: l.failureReason || 'Lamp Failure / Low Power',
      powerConsumption: `${l.telemetry?.powerConsumption || 0}W`,
      voltage: `${l.telemetry?.voltage || 0}V`,
      reportedTime: l.telemetry?.lastReported || l.updatedAt
    }));

    res.status(200).json({
      success: true,
      totalFailures: failureSummary.length,
      monitorType: 'Real-time IoT Streetlight Health Engine',
      data: failureSummary
    });
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
    light.failureReason = reason || 'Lamp Failure';
    light.telemetry = {
      powerConsumption: powerConsumption !== undefined ? powerConsumption : 0,
      voltage: voltage !== undefined ? voltage : 210,
      current: 0,
      isLampDefective: true,
      lastReported: new Date()
    };
    await light.save();
    
    // Automatically generate a Complaint in the system
    const { Complaint } = await import('../../models/Complaint.js');
    const complaintId = `IOT-CMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const complaint = await Complaint.create({
      complaintId,
      category: reason || 'Light Not Working (IoT Triggered)',
      description: `IoT Automated Telemetry Report: ${reason || 'Zero wattage detected'} on ${light.roadName || 'Main Street'}`,
      location: light.location,
      status: 'AI Classified & Prioritized',
      priority: 'Critical',
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
        source: 'Smart IoT Streetlight Controller'
      },
      'IoT System'
    );
    
    res.status(200).json({ success: true, message: 'Failure registered and AI complaint generated.', data: { light, complaint } });
  } catch (err) {
    next(err);
  }
};
