import mongoose from 'mongoose';

const PoliceUnitSchema = new mongoose.Schema({
  unitId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['PATROL_CAR', 'INTERCEPTOR', 'MOTORCYCLE'],
    default: 'PATROL_CAR'
  },
  status: {
    type: String,
    enum: ['STANDBY', 'DISPATCHED', 'EN_ROUTE', 'ON_SCENE', 'PATROLLING', 'RETURNING'],
    default: 'STANDBY'
  },
  currentTask: {
    type: String,
    default: 'Available'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  officers: [String],
  zone: String
}, {
  timestamps: true
});

PoliceUnitSchema.index({ location: '2dsphere' });

export default mongoose.model('PoliceUnit', PoliceUnitSchema);
