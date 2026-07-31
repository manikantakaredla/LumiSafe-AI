import mongoose from 'mongoose';

const workOrderSchema = new mongoose.Schema({
  workOrderId: { type: String, required: true, unique: true }, // e.g. WO-1234
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
  
  assignedTeamId: { type: mongoose.Schema.Types.ObjectId, ref: 'RepairTeam' },
  assignedEngineerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  status: { 
    type: String, 
    enum: ['Pending', 'Task Accepted', 'En Route', 'Arrived On Site', 'Repairing', 'Verifying Evidence', 'Needs Review', 'Resolved'],
    default: 'Pending'
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
