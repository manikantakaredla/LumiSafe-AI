import mongoose from 'mongoose';

const wardSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g. "Ward 4"
  zone: { type: String, required: true },
  
  // Geospatial Data (Polygon for boundaries)
  boundary: {
    type: { type: String, enum: ['Polygon'], default: 'Polygon' },
    coordinates: { type: [[[Number]]], required: true }
  },
  
  safetyIndex: { type: Number, default: 100 },
  criticalAssets: { type: Number, default: 0 },
  population: { type: Number }
  
}, { timestamps: true });

wardSchema.index({ boundary: '2dsphere' });

export const Ward = mongoose.model('Ward', wardSchema);
