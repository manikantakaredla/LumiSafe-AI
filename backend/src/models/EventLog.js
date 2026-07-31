import mongoose from 'mongoose';

const eventLogSchema = new mongoose.Schema({
  eventType: { type: String, required: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  entityModel: { type: String, required: true }, // e.g. 'Complaint', 'WorkOrder'
  
  payload: { type: mongoose.Schema.Types.Mixed }, // Arbitrary event data
  
  triggeredBy: { type: String, default: 'System' }, // e.g. User ID or 'AI Engine'
  correlationId: { type: String },
  
  timestamp: { type: Date, default: Date.now }
});

eventLogSchema.index({ entityId: 1, timestamp: -1 });

export const EventLog = mongoose.model('EventLog', eventLogSchema);
