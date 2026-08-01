import mongoose from 'mongoose';

const crimeIncidentSchema = new mongoose.Schema({
  incidentId: { type: String, required: true, unique: true }, // e.g. CRM-2026-801
  type: { 
    type: String, 
    enum: [
      'Chain Snatching', 
      'Eve Teasing / Harassment', 
      'Night Burglary', 
      'Vehicle Theft', 
      'Robbery / Mugging', 
      'Suspicious Night Activity'
    ], 
    required: true 
  },
  zone: { type: String, required: true },
  wardNo: { type: Number },
  address: { type: String, required: true }, // e.g. "Near St. Joseph's Women's College, Gnanapuram"
  
  // Vulnerability profile of the surrounding area
  sensitivity: { 
    type: String, 
    enum: ['WOMENS_COLLEGE', 'BUS_STOP', 'HEAVY_FOOTFALL', 'TEMPLE_COMMERCIAL', 'DARK_ALLEY', 'RESIDENTIAL_SECTOR'],
    default: 'DARK_ALLEY'
  },
  
  // Geospatial Data
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  
  timeOfDay: { type: String, enum: ['LATE_NIGHT', 'NIGHT', 'EVENING', 'DAY'], default: 'NIGHT' },
  incidentDate: { type: Date, default: Date.now },
  
  // Linkage to lighting condition during crime
  lightingCondition: { 
    type: String, 
    enum: ['DARK_POWER_OUTAGE', 'POLE_DEFECTIVE', 'DIM_LIGHTING', 'WELL_LIT'], 
    default: 'DARK_POWER_OUTAGE' 
  },
  
  nearestPoleId: { type: String }, // e.g. SL-1023
  policeStation: { type: String, required: true }, // e.g. "MVP Colony Police Station"
  severityScore: { type: Number, default: 85 } // 1-100 rating for Darkness Risk Score calculation

}, { timestamps: true });

crimeIncidentSchema.index({ location: '2dsphere' });
crimeIncidentSchema.index({ sensitivity: 1, lightingCondition: 1 });

export const CrimeIncident = mongoose.model('CrimeIncident', crimeIncidentSchema);
