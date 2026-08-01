import { User } from '../models/User.js';
import { RepairTeam } from '../models/RepairTeam.js';
import { Ward } from '../models/Ward.js';
import { StreetLight } from '../models/StreetLight.js';
import { Complaint } from '../models/Complaint.js';
import { WorkOrder } from '../models/WorkOrder.js';
import { VerificationReport } from '../models/VerificationReport.js';
import { CrimeIncident } from '../models/CrimeIncident.js';
import PoliceUnit from '../models/PoliceUnit.js';
import logger from '../shared/logger.js';
import mongoose from 'mongoose';

const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

export const seedAnalytics = async () => {
  try {
    logger.info('[Seeder] Starting Real Visakhapatnam (GVMC) Dataset & Safety Intelligence Seeding...');

    await Ward.deleteMany({});
    await StreetLight.deleteMany({});
    await Complaint.deleteMany({});
    await WorkOrder.deleteMany({});
    await VerificationReport.deleteMany({});
    await CrimeIncident.deleteMany({});
    await PoliceUnit.deleteMany({});
    logger.info('[Seeder] Cleared previous analytics collections.');

    // 1. Create Authentic GVMC Wards mapped to real 10 Zones of Visakhapatnam
    const gvmcWardsData = [
      { name: 'Ward 18 - MVP Colony Sector 1-4', zone: 'East Zone', safetyIndex: 78, criticalAssets: 14, boundary: { type: 'Polygon', coordinates: [[ [83.325, 17.735], [83.342, 17.735], [83.342, 17.750], [83.325, 17.750], [83.325, 17.735] ]] } },
      { name: 'Ward 24 - Siripuram & AU Campus', zone: 'East Zone', safetyIndex: 65, criticalAssets: 22, boundary: { type: 'Polygon', coordinates: [[ [83.310, 17.718], [83.330, 17.718], [83.330, 17.732], [83.310, 17.732], [83.310, 17.718] ]] } },
      { name: 'Ward 32 - RTC Complex & Asilmetta', zone: 'South Zone', safetyIndex: 60, criticalAssets: 28, boundary: { type: 'Polygon', coordinates: [[ [83.295, 17.710], [83.312, 17.710], [83.312, 17.725], [83.295, 17.725], [83.295, 17.710] ]] } },
      { name: 'Ward 88 - Gajuwaka Junction & Steel Plant Road', zone: 'Gajuwaka Zone', safetyIndex: 72, criticalAssets: 19, boundary: { type: 'Polygon', coordinates: [[ [83.205, 17.680], [83.228, 17.680], [83.228, 17.702], [83.205, 17.702], [83.205, 17.680] ]] } },
      { name: 'Ward 9 - Madhurawada & Rushikonda IT SEZ', zone: 'Madhurawada Zone', safetyIndex: 88, criticalAssets: 12, boundary: { type: 'Polygon', coordinates: [[ [83.360, 17.805], [83.390, 17.805], [83.390, 17.835], [83.360, 17.835], [83.360, 17.805] ]] } },
      { name: 'Ward 51 - Akkayyapalem & NH-16 Corridor', zone: 'North Zone', safetyIndex: 74, criticalAssets: 16, boundary: { type: 'Polygon', coordinates: [[ [83.280, 17.728], [83.305, 17.728], [83.305, 17.745], [83.280, 17.745], [83.280, 17.728] ]] } },
      { name: 'Ward 71 - Kancharapalem & Railway Colony', zone: 'West Zone', safetyIndex: 68, criticalAssets: 21, boundary: { type: 'Polygon', coordinates: [[ [83.265, 17.715], [83.285, 17.715], [83.285, 17.735], [83.265, 17.735], [83.265, 17.715] ]] } },
      { name: 'Ward 115 - Pendurthi Center', zone: 'Pendurthi Zone', safetyIndex: 82, criticalAssets: 9, boundary: { type: 'Polygon', coordinates: [[ [83.210, 17.800], [83.235, 17.800], [83.235, 17.825], [83.210, 17.825], [83.210, 17.800] ]] } },
      { name: 'Ward 3 - Bheemunipatnam Heritage Town', zone: 'Bheemunipatnam Zone', safetyIndex: 91, criticalAssets: 7, boundary: { type: 'Polygon', coordinates: [[ [83.435, 17.885], [83.465, 17.885], [83.465, 17.915], [83.435, 17.915], [83.435, 17.885] ]] } },
      { name: 'Ward 108 - Anakapalli Town Ring Road', zone: 'Anakapalli Zone', safetyIndex: 79, criticalAssets: 11, boundary: { type: 'Polygon', coordinates: [[ [83.000, 17.685], [83.025, 17.685], [83.025, 17.715], [83.000, 17.715], [83.000, 17.685] ]] } },
      { name: 'Ward 104 - Aganampudi Toll Plaza Hub', zone: 'Aganampudi Zone', safetyIndex: 84, criticalAssets: 8, boundary: { type: 'Polygon', coordinates: [[ [83.155, 17.675], [83.180, 17.675], [83.180, 17.700], [83.155, 17.700], [83.155, 17.675] ]] } }
    ];
    const createdWards = await Ward.insertMany(gvmcWardsData);

    // 2. Create Authentic Smart IoT Street Lights across real Visakhapatnam roads & junctions
    const streetLightSeeds = [
      { assetId: 'SL-1023', roadName: 'MVP Colony Sector-3 Main Road', zone: 'East Zone', wardIdx: 0, coords: [83.3338, 17.7424], status: 'OFF', reason: 'Lamp Failure', watts: 0, volts: 228 },
      { assetId: 'SL-1024', roadName: 'MVP Double Road near Alwar Das Stadium', zone: 'East Zone', wardIdx: 0, coords: [83.3361, 17.7451], status: 'Operational', reason: 'None', watts: 118, volts: 230 },
      { assetId: 'SL-2041', roadName: 'St. Josephs Womens College Road, Gnanapuram', zone: 'East Zone', wardIdx: 1, coords: [83.2985, 17.7121], status: 'OFF', reason: 'Power Supply Cable Cut', watts: 0, volts: 0 },
      { assetId: 'SL-2042', roadName: 'Andhra University South Campus Gate Road', zone: 'East Zone', wardIdx: 1, coords: [83.3210, 17.7245], status: 'Defective', reason: 'Voltage Fluctuations (Blinking)', watts: 45, volts: 184 },
      { assetId: 'SL-3089', roadName: 'RTC Complex Central Bus Stand Shelter-2', zone: 'South Zone', wardIdx: 2, coords: [83.3031, 17.7178], status: 'OFF', reason: 'Lamp Failure & MCB Tripped', watts: 0, volts: 231 },
      { assetId: 'SL-3090', roadName: 'Asilmetta Flyover Underpass Alley', zone: 'South Zone', wardIdx: 2, coords: [83.3065, 17.7212], status: 'OFF', reason: 'Lamp Failure', watts: 0, volts: 229 },
      { assetId: 'SL-4012', roadName: 'Gajuwaka Old Post Office Junction', zone: 'Gajuwaka Zone', wardIdx: 3, coords: [83.2162, 17.6871], status: 'Defective', reason: 'Water Damage in Photocell', watts: 28, volts: 212 },
      { assetId: 'SL-4015', roadName: 'BHPV Steel Plant Autonagar Road', zone: 'Gajuwaka Zone', wardIdx: 3, coords: [83.2120, 17.6835], status: 'Operational', reason: 'None', watts: 122, volts: 233 },
      { assetId: 'SL-5055', roadName: 'Rushikonda IT SEZ Hill-2 Main Curve', zone: 'Madhurawada Zone', wardIdx: 4, coords: [83.3792, 17.8194], status: 'OFF', reason: 'High Mast Contactor Fault', watts: 0, volts: 235 },
      { assetId: 'SL-5056', roadName: 'GITAM Engineering College Front Gate Road', zone: 'Madhurawada Zone', wardIdx: 4, coords: [83.3768, 17.8162], status: 'Operational', reason: 'None', watts: 120, volts: 230 },
      { assetId: 'SL-6011', roadName: 'Akkayyapalem Highway Junction NH-16', zone: 'North Zone', wardIdx: 5, coords: [83.2925, 17.7342], status: 'Operational', reason: 'None', watts: 119, volts: 229 },
      { assetId: 'SL-7023', roadName: 'Kancharapalem Mettu Under-Bridge Road', zone: 'West Zone', wardIdx: 6, coords: [83.2741, 17.7219], status: 'OFF', reason: 'Lamp Failure & Broken Feeder', watts: 0, volts: 215 },
      { assetId: 'SL-8001', roadName: 'Bheemili Beach Promenade Heritage Curve', zone: 'Bheemunipatnam Zone', wardIdx: 8, coords: [83.4512, 17.8942], status: 'Operational', reason: 'None', watts: 120, volts: 230 }
    ];

    // Build remaining operational lights up to 85 total
    const allLights = streetLightSeeds.map((s) => ({
      assetId: s.assetId,
      wardId: createdWards[s.wardIdx]._id,
      roadName: s.roadName,
      zone: s.zone,
      electricalSection: `Sec-${s.wardIdx + 1}`,
      location: { type: 'Point', coordinates: s.coords },
      status: s.status,
      failureReason: s.reason,
      telemetry: {
        powerConsumption: s.watts,
        voltage: s.volts,
        current: s.watts > 0 ? parseFloat((s.watts / s.volts).toFixed(2)) : 0,
        isLampDefective: s.status !== 'Operational',
        lastReported: new Date(Date.now() - Math.floor(Math.random() * 3600000))
      },
      installedDate: new Date(2024, 2, 15),
      lastMaintained: new Date(2026, 5, 10)
    }));

    for (let i = allLights.length + 1; i <= 85; i++) {
      const ward = createdWards[i % createdWards.length];
      allLights.push({
        assetId: `SL-90${i < 10 ? '0' + i : i}`,
        wardId: ward._id,
        roadName: `Sector ${Math.floor(i/10) + 1} Feeder Line Road`,
        zone: ward.zone,
        electricalSection: 'General Section',
        location: { type: 'Point', coordinates: [83.25 + Math.random()*0.15, 17.68 + Math.random()*0.15] },
        status: 'Operational',
        failureReason: 'None',
        telemetry: { powerConsumption: 120, voltage: 230, current: 0.52, isLampDefective: false, lastReported: new Date() },
        installedDate: new Date(2025, 1, 20)
      });
    }
    const createdLights = await StreetLight.insertMany(allLights);

    // 3. Seed Authentic Crime / Incident Datasets around Sensitive Zones (Women's Colleges, Bus Stops, Dark Corners)
    const crimeIncidentsData = [
      {
        incidentId: 'CRM-2026-801',
        type: 'Eve Teasing / Harassment',
        zone: 'East Zone',
        wardNo: 24,
        address: 'Near St. Josephs Womens College Road, Gnanapuram',
        sensitivity: 'WOMENS_COLLEGE',
        location: { type: 'Point', coordinates: [83.2989, 17.7124] }, // Within 50m of defective SL-2041
        timeOfDay: 'NIGHT',
        lightingCondition: 'DARK_POWER_OUTAGE',
        nearestPoleId: 'SL-2041',
        policeStation: 'III-Town Police Station, Visakhapatnam',
        severityScore: 98
      },
      {
        incidentId: 'CRM-2026-802',
        type: 'Chain Snatching',
        zone: 'South Zone',
        wardNo: 32,
        address: 'RTC Complex Central Bus Stand Exit Road',
        sensitivity: 'BUS_STOP',
        location: { type: 'Point', coordinates: [83.3034, 17.7181] }, // Exactly next to failed SL-3089
        timeOfDay: 'LATE_NIGHT',
        lightingCondition: 'POLE_DEFECTIVE',
        nearestPoleId: 'SL-3089',
        policeStation: 'II-Town (Dwaraka Zone) Police Station',
        severityScore: 95
      },
      {
        incidentId: 'CRM-2026-803',
        type: 'Robbery / Mugging',
        zone: 'West Zone',
        wardNo: 71,
        address: 'Kancharapalem Railway Colony Dark Underpass',
        sensitivity: 'HEAVY_FOOTFALL',
        location: { type: 'Point', coordinates: [83.2745, 17.7222] }, // Near failed SL-7023
        timeOfDay: 'NIGHT',
        lightingCondition: 'DARK_POWER_OUTAGE',
        nearestPoleId: 'SL-7023',
        policeStation: 'V-Town Kancharapalem Police Station',
        severityScore: 92
      },
      {
        incidentId: 'CRM-2026-804',
        type: 'Suspicious Night Activity',
        zone: 'East Zone',
        wardNo: 18,
        address: 'MVP Colony Sector-3 Internal Park Corner Alley',
        sensitivity: 'RESIDENTIAL_SECTOR',
        location: { type: 'Point', coordinates: [83.3341, 17.7426] }, // Near SL-1023
        timeOfDay: 'LATE_NIGHT',
        lightingCondition: 'POLE_DEFECTIVE',
        nearestPoleId: 'SL-1023',
        policeStation: 'MVP Colony Police Station',
        severityScore: 82
      },
      {
        incidentId: 'CRM-2026-805',
        type: 'Vehicle Theft',
        zone: 'Gajuwaka Zone',
        wardNo: 88,
        address: 'Old Post Office Industrial Parking Lot, Gajuwaka',
        sensitivity: 'TEMPLE_COMMERCIAL',
        location: { type: 'Point', coordinates: [83.2165, 17.6874] },
        timeOfDay: 'LATE_NIGHT',
        lightingCondition: 'DIM_LIGHTING',
        nearestPoleId: 'SL-4012',
        policeStation: 'Gajuwaka Law & Order Police Station',
        severityScore: 78
      },
      {
        incidentId: 'CRM-2026-806',
        type: 'Eve Teasing / Harassment',
        zone: 'East Zone',
        wardNo: 24,
        address: 'AU South Campus Women Hostel Pathway',
        sensitivity: 'WOMENS_COLLEGE',
        location: { type: 'Point', coordinates: [83.3214, 17.7248] },
        timeOfDay: 'EVENING',
        lightingCondition: 'DIM_LIGHTING',
        nearestPoleId: 'SL-2042',
        policeStation: 'Three-Town PS',
        severityScore: 90
      }
    ];
    await CrimeIncident.insertMany(crimeIncidentsData);
    logger.info('[Seeder] Seeded real Visakhapatnam crime & vulnerable zone incident datasets.');

    // 3.5 Seed Police Units & Women Safety Patrols
    const policeUnitsData = [
      { unitId: 'P-MVP-101', name: 'MVP Rakshan Women Safety Patrol Car', type: 'PATROL_CAR', status: 'PATROLLING', currentTask: 'Monitoring Womens College Corridor & Siripuram Hub', location: { type: 'Point', coordinates: [83.3150, 17.7280] }, officers: ['Inspector S. Rao', 'SI K. Vani'], zone: 'East Zone' },
      { unitId: 'P-DVK-202', name: 'RTC Complex Interceptor & Night Highway Squad', type: 'INTERCEPTOR', status: 'ON_SCENE', currentTask: 'Covering unlit Bus Stand shelter following streetlight failure alert', location: { type: 'Point', coordinates: [83.3032, 17.7179] }, officers: ['SI P. Prasad', 'Constable M. Naidu'], zone: 'South Zone' },
      { unitId: 'P-GJK-303', name: 'Gajuwaka Industrial Highway Patrol', type: 'MOTORCYCLE', status: 'PATROLLING', currentTask: 'Night surveillance along BHPV & Autonagar unlit stretches', location: { type: 'Point', coordinates: [83.2150, 17.6860] }, officers: ['Head Constable V. Reddy'], zone: 'Gajuwaka Zone' }
    ];
    await PoliceUnit.insertMany(policeUnitsData);
    logger.info('[Seeder] Seeded Visakhapatnam City Police patrol vehicles.');

    // 4. Fetch Users and Teams for linking complaints & work orders
    const teams = await RepairTeam.find({});
    const citizens = await User.find({ role: 'Public' });
    const citizenId = citizens.length > 0 ? citizens[0]._id : new mongoose.Types.ObjectId();
    const alphaTeam = teams.find(t => t.name.includes('Alpha')) || teams[0];
    const betaTeam = teams.find(t => t.name.includes('Beta')) || teams[1] || teams[0];
    const gammaTeam = teams.find(t => t.name.includes('Gamma')) || teams[2] || teams[0];

    // 5. Create Complaints directly linked to the defective IoT Street Lights and Crime Hotspots
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 3600000);

    const complaintsData = [
      {
        complaintId: 'REP-40192',
        citizenId,
        category: 'No Power / Entire Street Dark',
        location: { type: 'Point', coordinates: [83.2985, 17.7121] },
        status: 'AI Classified & Prioritized',
        description: 'URGENT: Entire street totally dark in front of St. Josephs Womens College. Girls reporting harassment and fear during evening exit. Please repair instantly!',
        source: 'Citizen App & Police Control Room',
        aiPriority: 'Critical',
        aiCategory: 'Women Safety / Electrical Failure',
        createdAt: twoHoursAgo
      },
      {
        complaintId: 'REP-40193',
        citizenId,
        category: 'Lamp Failure',
        location: { type: 'Point', coordinates: [83.3031, 17.7178] },
        status: 'Assigned to Electrical Dept',
        description: 'RTC Complex Bus Stop Light SL-3089 is dead. Chain snatching incident occurred here last night due to extreme pitch darkness at shelter.',
        source: 'Police Station Alert (SHO)',
        aiPriority: 'Critical',
        aiCategory: 'Crime Hotspot / Public Shelter',
        createdAt: new Date(now.getTime() - 90 * 60000)
      },
      {
        complaintId: 'REP-40194',
        citizenId,
        category: 'Flickering / Defective Light',
        location: { type: 'Point', coordinates: [83.3338, 17.7424] },
        status: 'Assigned to Electrical Dept',
        description: 'MVP Colony Sector 3 pole SL-1023 is off since 2 days. Dark corner making residents feel unsafe at night.',
        source: 'Citizen App',
        aiPriority: 'High',
        aiCategory: 'Residential Sector',
        createdAt: new Date(now.getTime() - 60 * 60000)
      },
      {
        complaintId: 'REP-40195',
        citizenId,
        category: 'Broken Wire / Sparking',
        location: { type: 'Point', coordinates: [83.2162, 17.6871] },
        status: 'Issue Resolved',
        description: 'Sparks observed near photocell switch off Gajuwaka Post office road.',
        source: 'Field Inspector',
        aiPriority: 'Medium',
        aiCategory: 'Electrical Maintenance',
        createdAt: new Date(now.getTime() - 24 * 3600000)
      }
    ];
    const createdComplaints = await Complaint.insertMany(complaintsData);

    // 6. Create realistic Work Orders mapping Alpha, Beta & Gamma teams to these repairs
    const workOrdersData = [
      {
        workOrderId: 'WO-88210',
        complaintId: createdComplaints[0]._id, // St. Josephs Women's College
        assignedTeamId: alphaTeam._id,
        status: 'NAVIGATING',
        priority: 'Critical',
        createdAt: twoHoursAgo,
        acceptedAt: new Date(twoHoursAgo.getTime() + 10 * 60000),
        arrivedAt: new Date(twoHoursAgo.getTime() + 25 * 60000)
      },
      {
        workOrderId: 'WO-88211',
        complaintId: createdComplaints[1]._id, // RTC Complex Bus Shelter
        assignedTeamId: gammaTeam._id,
        status: 'ACCEPTED',
        priority: 'Critical',
        createdAt: new Date(now.getTime() - 80 * 60000),
        acceptedAt: new Date(now.getTime() - 70 * 60000)
      },
      {
        workOrderId: 'WO-88212',
        complaintId: createdComplaints[2]._id, // MVP Colony
        assignedTeamId: alphaTeam._id,
        status: 'ACCEPTED',
        priority: 'High',
        createdAt: new Date(now.getTime() - 50 * 60000),
        acceptedAt: new Date(now.getTime() - 40 * 60000)
      },
      {
        workOrderId: 'WO-88209',
        complaintId: createdComplaints[3]._id,
        assignedTeamId: betaTeam._id,
        status: 'RESOLVED',
        priority: 'Medium',
        createdAt: new Date(now.getTime() - 24 * 3600000),
        acceptedAt: new Date(now.getTime() - 23 * 3600000),
        arrivedAt: new Date(now.getTime() - 22 * 3600000),
        repairStartedAt: new Date(now.getTime() - 21 * 3600000),
        completedAt: new Date(now.getTime() - 20 * 3600000)
      }
    ];
    const createdWOs = await WorkOrder.insertMany(workOrdersData);

    // 7. Create Verification Reports for SLA & AI Audit
    const reportsData = [
      {
        reportId: 'VER-90101',
        workOrderId: createdWOs[3]._id,
        repairTeamId: betaTeam._id,
        confidenceScore: 96,
        gpsMatch: true,
        timestampValidation: true,
        beforePhotoAvailable: true,
        afterPhotoAvailable: true,
        decision: 'APPROVED',
        reason: 'AI confirmed replacement of damaged photocell switch unit. GPS matched within 4 meters of asset SL-4012.',
        slaMetrics: {
          responseTimeMins: 15,
          travelTimeMins: 30,
          repairDurationMins: 45,
          verificationDurationMins: 2,
          totalResolutionTimeMins: 92,
          targetSLAMins: 240,
          slaStatus: 'Within SLA'
        },
        generatedAt: createdWOs[3].completedAt || now
      }
    ];
    await VerificationReport.insertMany(reportsData);

    logger.info('[Seeder] Visakhapatnam Smart City Analytics & Crime Intelligence Seeding Completed Successfully!');

  } catch (err) {
    logger.error(`[Seeder] Failed Analytics Seed: ${err.message}`, err);
  }
};
