import mongoose from 'mongoose';

const verificationReportSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true }, // e.g. VER-1234
  workOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkOrder', required: true },
  
  engineerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  repairTeamId: { type: mongoose.Schema.Types.ObjectId, ref: 'RepairTeam' },
  
  confidenceScore: { type: Number, required: true },
  
  gpsMatch: { type: Boolean, required: true },
  timestampValidation: { type: Boolean, required: true },
  
  beforePhotoAvailable: { type: Boolean, default: false },
  afterPhotoAvailable: { type: Boolean, default: false },
  
  inventoryLogged: [{ type: String }],
  
  slaMetrics: {
    responseTimeMins: { type: Number },
    travelTimeMins: { type: Number },
    repairDurationMins: { type: Number },
    verificationDurationMins: { type: Number },
    totalResolutionTimeMins: { type: Number },
    targetSLAMins: { type: Number, default: 240 },
    slaStatus: { type: String, enum: ['Within SLA', 'Exceeded SLA'] }
  },
  
  decision: { type: String, enum: ['APPROVED', 'REJECTED', 'MANUAL_REVIEW'], required: true },
  reason: { type: String },
  
  generatedAt: { type: Date, default: Date.now },
  generatedBy: { type: String, default: 'Verification Engine' } // Immutable
}, { timestamps: true });

export const VerificationReport = mongoose.model('VerificationReport', verificationReportSchema);
