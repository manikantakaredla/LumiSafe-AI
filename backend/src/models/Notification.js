import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  targetRole: { type: String, enum: ['Commissioner', 'Electrical Supervisor', 'Field Engineer', 'All'] },
  targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional specific user target
  
  title: { type: String, required: true },
  message: { type: String, required: true },
  
  type: { type: String, enum: ['Alert', 'WorkOrder', 'System', 'AI Recommendation'], default: 'System' },
  read: { type: Boolean, default: false },
  
  relatedEntity: { type: mongoose.Schema.Types.ObjectId }, // e.g. Complaint ID or WorkOrder ID
  entityModel: { type: String, enum: ['Complaint', 'WorkOrder'] }

}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema);
