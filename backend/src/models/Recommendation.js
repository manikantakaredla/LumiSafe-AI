import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' },
  
  reason: { type: String, required: true },
  confidence: { type: String, required: true },
  
  rulesApplied: [{ type: String }],
  expectedImpact: { type: String },
  
  // Future ML Data hook
  mlModelVersion: { type: String },
  rawScore: { type: Number }

}, { timestamps: true });

export const Recommendation = mongoose.model('Recommendation', recommendationSchema);
