import PoliceUnit from '../../models/PoliceUnit.js';
import { CrimeIncident } from '../../models/CrimeIncident.js';
import { StreetLight } from '../../models/StreetLight.js';
import { eventBus } from '../../engine/eventbus/eventBus.js';

export const getAllUnits = async (req, res) => {
  try {
    const units = await PoliceUnit.find();
    res.json({ success: true, data: units });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getCrimes = async (req, res) => {
  try {
    const { sensitivity, zone, lightingCondition } = req.query;
    const query = {};
    if (sensitivity) query.sensitivity = sensitivity;
    if (zone) query.zone = zone;
    if (lightingCondition) query.lightingCondition = lightingCondition;

    const crimes = await CrimeIncident.find(query).sort({ incidentDate: -1 });
    res.json({ success: true, count: crimes.length, data: crimes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * AI Darkness Risk Index (DRI) & Crime Interlock Engine
 * Bridges real-time defective IoT Streetlight data with police crime records & high-sensitivity landmarks
 * (Women's Colleges, Bus Stops, Heavy Footfall transit hubs).
 */
export const getDarknessRiskAssessment = async (req, res) => {
  try {
    // 1. Fetch all currently defective/OFF street lights or lights reporting 0 Watts
    const failedLights = await StreetLight.find({
      $or: [
        { status: { $in: ['OFF', 'Failed', 'Defective'] } },
        { 'telemetry.powerConsumption': 0 },
        { 'telemetry.isLampDefective': true }
      ]
    }).populate('wardId');

    // 2. Fetch recent crime incidents and sensitive landmarks
    const incidents = await CrimeIncident.find();

    const riskAssessments = [];

    // 3. Correlate lighting outages with crime risk profile
    for (const light of failedLights) {
      // Find crimes or vulnerable points associated with this pole or located in the same zone/sector
      const correlatedIncidents = incidents.filter(c => 
        c.nearestPoleId === light.assetId || 
        (c.zone === light.zone && Math.abs(c.location.coordinates[0] - light.location.coordinates[0]) < 0.05)
      );

      let riskScore = 50; // Base score for any unlit street
      let riskLevel = 'MODERATE';
      let sensitivityTag = 'STANDARD_ROAD';
      const riskReasons = [`Pole ${light.assetId} (${light.status}): ${light.failureReason || 'No power output'}`];

      if (correlatedIncidents.length > 0) {
        // Boost score based on sensitivity type (Women's Colleges & Bus stops get highest escalation)
        for (const inc of correlatedIncidents) {
          if (inc.sensitivity === 'WOMENS_COLLEGE') {
            riskScore += 35;
            sensitivityTag = 'WOMENS_COLLEGE_ZONE';
            riskReasons.push(`CRITICAL VULNERABILITY: Total blackout outside Women's College (${inc.address}). History of ${inc.type}.`);
          } else if (inc.sensitivity === 'BUS_STOP') {
            riskScore += 28;
            if (sensitivityTag !== 'WOMENS_COLLEGE_ZONE') sensitivityTag = 'TRANSIT_BUS_STOP';
            riskReasons.push(`HIGH VULNERABILITY: Public Transit Shelter pitch dark (${inc.address}). Previous incident: ${inc.type}.`);
          } else if (inc.sensitivity === 'HEAVY_FOOTFALL') {
            riskScore += 20;
            if (sensitivityTag === 'STANDARD_ROAD') sensitivityTag = 'HEAVY_FOOTFALL_AREA';
            riskReasons.push(`PUBLIC SAFETY HAZARD: Unlit high-footfall underpass/pedestrian crossing (${inc.address}).`);
          } else {
            riskScore += 15;
            riskReasons.push(`Past incident in vicinity: ${inc.type} at ${inc.address}`);
          }
        }
      }

      riskScore = Math.min(riskScore, 99); // Capped at 99
      if (riskScore >= 85) riskLevel = 'CRITICAL';
      else if (riskScore >= 70) riskLevel = 'HIGH';

      riskAssessments.push({
        assetId: light.assetId,
        roadName: light.roadName,
        zone: light.zone || 'East Zone',
        wardName: light.wardId ? light.wardId.name : 'Unassigned Ward',
        coordinates: light.location.coordinates,
        lightStatus: light.status,
        failureReason: light.failureReason || 'Lamp Failure',
        powerWatts: light.telemetry?.powerConsumption || 0,
        darknessRiskIndex: riskScore,
        riskLevel,
        sensitivityCategory: sensitivityTag,
        aiDiagnosticReasons: riskReasons,
        recommendedIntervencion: riskScore >= 85
          ? `[IMMEDIATE OVERRIDE] Dispatch Electrical Team instantly AND route Police Patrol to hover around ${light.roadName} until lighting is functional.`
          : `[HIGH PRIORITY] Assign work order to Field Engineer within 4-hour SLA.`
      });
    }

    // Sort by Darkness Risk Index descending
    riskAssessments.sort((a, b) => b.darknessRiskIndex - a.darknessRiskIndex);

    res.json({
      success: true,
      engineName: 'LumiSafe AI Darkness Risk Index (DRI)',
      totalBlackoutHazards: riskAssessments.length,
      criticalHighRiskZones: riskAssessments.filter(r => r.riskLevel === 'CRITICAL').length,
      data: riskAssessments
    });

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
