import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Commissioner', 'Electrical Supervisor', 'Field Engineer', 'City Operations', 'Police', 'Public', 'Admin'],
    default: 'Public'
  },
  phone: { type: String },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'RepairTeam' }, // If assigned to a specific field team
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
