import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema({
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
  
  label: { type: String, required: true },
  detail: { type: String },
  
  // Who triggered this timeline event (System/Engine or a specific User)
  actor: { type: String, default: 'AI Operations Engine' },
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  eventData: { type: mongoose.Schema.Types.Mixed }, // Arbitrary payload

  timestamp: { type: Date, default: Date.now }

}, { timestamps: true });

timelineSchema.index({ reportId: 1, timestamp: 1 });

export const Timeline = mongoose.model('Timeline', timelineSchema);
