import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, required: true, unique: true },
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // null if guest
  guestPhone: { type: String }, // For guest tracking
  category: { type: String, required: true },
  description: { type: String },
  
  // Geospatial Data
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  
  status: { 
    type: String, 
    enum: ['Report Submitted', 'AI Classified & Prioritized', 'Assigned to Electrical Dept', 'Needs Review', 'Issue Resolved', 'Rejected'],
    default: 'Report Submitted'
  },
  
  priority: { type: String, enum: ['Critical', 'High', 'Medium', 'Low', 'Pending'], default: 'Pending' },
  wardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ward' },
  nearestAssetId: { type: mongoose.Schema.Types.ObjectId, ref: 'StreetLight' },
  
  aiExplanation: { type: mongoose.Schema.Types.ObjectId, ref: 'Recommendation' },
  workOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkOrder' }

}, { timestamps: true });

// 2dsphere index for GIS spatial queries
complaintSchema.index({ location: '2dsphere' });
complaintSchema.index({ status: 1, priority: 1 });

export const Complaint = mongoose.model('Complaint', complaintSchema);
