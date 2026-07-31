import mongoose from 'mongoose';

const repairTeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, default: 'Electrical' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['AVAILABLE', 'ASSIGNED', 'EN_ROUTE', 'ON_SITE', 'REPAIRING', 'BLOCKED', 'RETURNING', 'OFFLINE'], default: 'AVAILABLE' },
  currentLocation: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number] } // [lng, lat]
  },
  activeWorkOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkOrder' },
  inventory: [{ type: String }],
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

repairTeamSchema.index({ currentLocation: '2dsphere' });

export const RepairTeam = mongoose.model('RepairTeam', repairTeamSchema);
