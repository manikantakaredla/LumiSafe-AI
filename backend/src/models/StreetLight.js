import mongoose from 'mongoose';

const streetLightSchema = new mongoose.Schema({
  assetId: { type: String, required: true, unique: true }, // e.g. SL-8842
  wardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ward', required: true },
  electricalSection: { type: String },
  
  // Geospatial Data
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  
  status: { type: String, enum: ['Operational', 'Failed', 'Maintenance'], default: 'Operational' },
  type: { type: String, default: 'LED 120W' },
  installedDate: { type: Date },
  lastMaintained: { type: Date },
  qrCodeUrl: { type: String }
  
}, { timestamps: true });

streetLightSchema.index({ location: '2dsphere' });
streetLightSchema.index({ assetId: 1 });

export const StreetLight = mongoose.model('StreetLight', streetLightSchema);
