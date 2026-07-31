import mongoose from 'mongoose';

const evidenceSchema = new mongoose.Schema({
  workOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkOrder', required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  beforePhotoUrl: { type: String },
  afterPhotoUrl: { type: String, required: true },
  
  // Verification Data
  gpsLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number] } // [longitude, latitude]
  },
  uploadedAt: { type: Date, default: Date.now },
  
  // AI Verification Results
  confidenceScore: { type: Number },
  verificationChecks: {
    gpsMatch: { type: Boolean },
    timestampValid: { type: Boolean },
    photoPresence: { type: Boolean },
    inventoryRecorded: { type: Boolean }
  },
  
  status: { type: String, enum: ['Pending', 'Verified', 'Rejected', 'Manual Review'], default: 'Pending' }

}, { timestamps: true });

export const Evidence = mongoose.model('Evidence', evidenceSchema);
