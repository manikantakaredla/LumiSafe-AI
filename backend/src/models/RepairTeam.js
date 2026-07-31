import mongoose from 'mongoose';

const repairTeamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g. "Alpha Team"
  zone: { type: String, required: true },
  vehicle: { type: String },
  
  status: { type: String, enum: ['Active', 'Standby', 'Offline'], default: 'Standby' },
  
  // Geospatial Data (Live Tracking)
  currentLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number] } // [longitude, latitude]
  },
  
  activeWorkOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkOrder' },
  
  capacity: { type: Number, default: 5 } // Tasks per day

}, { timestamps: true });

repairTeamSchema.index({ currentLocation: '2dsphere' });

export const RepairTeam = mongoose.model('RepairTeam', repairTeamSchema);
