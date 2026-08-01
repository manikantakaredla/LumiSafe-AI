import mongoose from 'mongoose';

const streetLightSchema = new mongoose.Schema({
  assetId: { type: String, required: true, unique: true }, // e.g. SL-1023
  wardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ward' },
  roadName: { type: String, required: true }, // e.g. "MVP Colony Sector-3 Road"
  zone: { type: String }, // e.g. "East Zone", "Gajuwaka Zone"
  electricalSection: { type: String },
  
  // Geospatial Data
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  
  status: { type: String, enum: ['Operational', 'Failed', 'Defective', 'Maintenance', 'OFF'], default: 'Operational' },
  failureReason: { type: String }, // e.g. "Lamp Failure", "Voltage Fluctuations", "Cable Cut", "None"
  type: { type: String, default: 'LED 120W Smart IoT' },
  
  // IoT Real-time Telemetry
  telemetry: {
    powerConsumption: { type: Number, default: 120 }, // in Watts
    voltage: { type: Number, default: 230 }, // in Volts
    current: { type: Number, default: 0.52 }, // in Amperes
    isLampDefective: { type: Boolean, default: false },
    lastReported: { type: Date, default: Date.now }
  },

  installedDate: { type: Date },
  lastMaintained: { type: Date }
}, { timestamps: true });

streetLightSchema.index({ location: '2dsphere' });

export const StreetLight = mongoose.model('StreetLight', streetLightSchema);
