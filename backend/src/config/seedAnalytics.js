import { User } from '../models/User.js';
import { RepairTeam } from '../models/RepairTeam.js';
import { Ward } from '../models/Ward.js';
import { StreetLight } from '../models/StreetLight.js';
import { Complaint } from '../models/Complaint.js';
import { WorkOrder } from '../models/WorkOrder.js';
import { VerificationReport } from '../models/VerificationReport.js';
import logger from '../shared/logger.js';
import mongoose from 'mongoose';

const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

export const seedAnalytics = async () => {
  try {
    const complaintCount = await Complaint.countDocuments();
    if (complaintCount > 20) {
      logger.info('[Seeder] Analytics data appears to already exist. Skipping seedAnalytics.');
      return;
    }

    logger.info('[Seeder] Starting Analytics Seeding...');

    // 1. Create Wards
    const wards = [];
    for (let i = 1; i <= 7; i++) {
      wards.push({
        name: `Ward ${i}`,
        zone: ['North', 'South', 'East', 'West', 'Central'][Math.floor(Math.random() * 5)],
        boundary: { type: 'Polygon', coordinates: [[ [83.3, 17.7], [83.4, 17.7], [83.4, 17.8], [83.3, 17.8], [83.3, 17.7] ]] },
        safetyIndex: 80 + Math.floor(Math.random() * 20),
        criticalAssets: Math.floor(Math.random() * 10)
      });
    }
    const createdWards = await Ward.insertMany(wards);

    // 2. Create Street Lights
    const lights = [];
    for (let i = 1; i <= 100; i++) {
      lights.push({
        assetId: `SL-${1000 + i}`,
        wardId: createdWards[i % 7]._id,
        electricalSection: 'Section A',
        location: { type: 'Point', coordinates: [83.3 + Math.random()*0.1, 17.7 + Math.random()*0.1] },
        status: 'Operational'
      });
    }
    const createdLights = await StreetLight.insertMany(lights);

    // 3. Create Teams
    const teams = [];
    const engineers = await User.find({ role: 'Field Engineer' });
    const engId = engineers.length > 0 ? engineers[0]._id : new mongoose.Types.ObjectId();
    
    for (let i = 1; i <= 15; i++) {
      teams.push({
        name: `Team ${String.fromCharCode(64 + i)}`, // Team A, B, C...
        members: [engId],
        status: ['AVAILABLE', 'EN_ROUTE', 'REPAIRING', 'AVAILABLE'][Math.floor(Math.random() * 4)],
        currentLocation: { type: 'Point', coordinates: [83.3, 17.7] },
        inventory: ['LED Lamp', 'Wire']
      });
    }
    const createdTeams = await RepairTeam.insertMany(teams);

    // 4. Create Complaints (70)
    const complaints = [];
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    for (let i = 1; i <= 70; i++) {
      const cDate = randomDate(thirtyDaysAgo, now);
      const isResolved = i <= 55; // First 55 will have WOs and be resolved mostly
      complaints.push({
        complaintId: `REP-${Math.floor(10000 + Math.random() * 90000)}`,
        citizenId: new mongoose.Types.ObjectId(),
        category: ['Broken Pole', 'Flickering Light', 'No Power', 'Wire Sparking'][Math.floor(Math.random() * 4)],
        location: { type: 'Point', coordinates: [83.3, 17.7] },
        status: isResolved ? 'Issue Resolved' : 'AI Processing',
        description: 'Auto-generated seed complaint',
        imageUrl: 'mock.jpg',
        source: 'Citizen App',
        aiPriority: ['Critical', 'High', 'Medium', 'Low'][Math.floor(Math.random() * 4)],
        aiCategory: 'Electrical',
        createdAt: cDate
      });
    }
    const createdComplaints = await Complaint.insertMany(complaints);

    // 5. Create WorkOrders (55)
    const wos = [];
    for (let i = 0; i < 55; i++) {
      const comp = createdComplaints[i];
      const team = createdTeams[i % 15];
      const isCompleted = i < 40; // 40 completed, 15 pending

      const woDate = new Date(comp.createdAt.getTime() + 10 * 60000); // 10 mins after complaint
      const acceptedDate = new Date(woDate.getTime() + (Math.random() * 30 + 5) * 60000); // 5-35 mins later
      const arrivedDate = new Date(acceptedDate.getTime() + (Math.random() * 40 + 10) * 60000); // 10-50 mins travel
      const repairStartedDate = new Date(arrivedDate.getTime() + 5 * 60000);
      const completedDate = new Date(repairStartedDate.getTime() + (Math.random() * 60 + 20) * 60000); // 20-80 mins repair

      wos.push({
        workOrderId: `WO-${Math.floor(10000 + Math.random() * 90000)}`,
        complaintId: comp._id,
        assignedTeamId: team._id,
        assignedEngineerId: engId,
        status: isCompleted ? 'RESOLVED' : ['ACCEPTED', 'NAVIGATING', 'ARRIVED', 'REPAIRING'][Math.floor(Math.random() * 4)],
        priority: comp.aiPriority || 'Medium',
        createdAt: woDate,
        acceptedAt: acceptedDate,
        arrivedAt: arrivedDate,
        repairStartedAt: repairStartedDate,
        completedAt: isCompleted ? completedDate : undefined
      });
    }
    const createdWOs = await WorkOrder.insertMany(wos);

    // 6. Create VerificationReports (40)
    const reports = [];
    for (let i = 0; i < 40; i++) {
      const wo = createdWOs[i];
      const isApproved = Math.random() > 0.1; // 90% success rate
      
      const responseTime = Math.round((wo.acceptedAt - wo.createdAt) / 60000);
      const travelTime = Math.round((wo.arrivedAt - wo.acceptedAt) / 60000);
      const repairTime = Math.round((wo.completedAt - wo.repairStartedAt) / 60000);
      const totalTime = Math.round((wo.completedAt - wo.createdAt) / 60000);
      const slaStatus = totalTime <= 240 ? 'Within SLA' : 'Exceeded SLA';

      reports.push({
        reportId: `VER-${Math.floor(10000 + Math.random() * 90000)}`,
        workOrderId: wo._id,
        engineerId: wo.assignedEngineerId,
        repairTeamId: wo.assignedTeamId,
        confidenceScore: isApproved ? (85 + Math.floor(Math.random() * 15)) : (60 + Math.floor(Math.random() * 20)),
        gpsMatch: true,
        timestampValidation: true,
        beforePhotoAvailable: true,
        afterPhotoAvailable: true,
        decision: isApproved ? 'APPROVED' : 'MANUAL_REVIEW',
        reason: 'Seeded record',
        slaMetrics: {
          responseTimeMins: responseTime,
          travelTimeMins: travelTime,
          repairDurationMins: repairTime,
          verificationDurationMins: 2,
          totalResolutionTimeMins: totalTime,
          targetSLAMins: 240,
          slaStatus: slaStatus
        },
        generatedAt: wo.completedAt
      });
    }
    await VerificationReport.insertMany(reports);

    logger.info('[Seeder] Analytics Seeding Complete.');

  } catch (err) {
    logger.error(`[Seeder] Failed Analytics Seed: ${err.message}`);
  }
};
