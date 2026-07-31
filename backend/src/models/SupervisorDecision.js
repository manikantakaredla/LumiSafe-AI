import mongoose from 'mongoose';

const supervisorDecisionSchema = new mongoose.Schema({
  workOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkOrder', required: true },
  supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  action: { type: String, enum: ['APPROVE', 'REJECT', 'REQUEST_REWORK'], required: true },
  reason: { type: String, required: true },
  
  previousStatus: { type: String },
  newStatus: { type: String },
  
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export const SupervisorDecision = mongoose.model('SupervisorDecision', supervisorDecisionSchema);
