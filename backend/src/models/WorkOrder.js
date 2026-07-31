import mongoose from 'mongoose';

const workOrderSchema = new mongoose.Schema({
  workOrderId: { type: String, required: true, unique: true }, // e.g. WO-1234
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
  
  assignedTeamId: { type: mongoose.Schema.Types.ObjectId, ref: 'RepairTeam' },
  assignedEngineerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  status: { 
    type: String, 
    enum: ['CREATED', 'UNASSIGNED', 'ASSIGNED', 'ACCEPTED', 'NAVIGATING', 'ARRIVED', 'REPAIRING', 'BLOCKED', 'EVIDENCE_PENDING', 'VERIFYING', 'MANUAL_REVIEW_REQUIRED', 'RESOLVED', 'CLOSED', 'Pending', 'In Progress', 'Issue Resolved'], // Kept legacy strings temporarily to avoid breaking old data in DB
    default: 'UNASSIGNED'
  },
  
  priority: { type: String, enum: ['Critical', 'High', 'Medium', 'Low'] },
  
  requiredInventory: [{ type: String }],
  
  estimatedRepairTime: { type: Number }, // in minutes
  budgetAllocated: { type: Number },
  
  evidenceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Evidence' },
  
  // Timing metrics
  acceptedAt: { type: Date },
  arrivedAt: { type: Date },
  completedAt: { type: Date }

}, { timestamps: true });

workOrderSchema.index({ assignedTeamId: 1, status: 1 });

export const WorkOrder = mongoose.model('WorkOrder', workOrderSchema);
