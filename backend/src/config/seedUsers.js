import { User } from '../models/User.js';
import { RepairTeam } from '../models/RepairTeam.js';
import logger from '../shared/logger.js';

export const seedUsers = async () => {
  try {
    const count = await User.countDocuments();
    if (count > 0) {
      logger.info('[Seeder] Data already exists. Skipping seed.');
      return;
    }

    const defaultPassword = 'password123';
    
    const users = [
      { name: 'Dr. Hari', email: 'commissioner@lumisafe.ai', password: defaultPassword, role: 'Commissioner', department: 'Executive' },
      { name: 'Ramesh (Supervisor)', email: 'electrical@lumisafe.ai', password: defaultPassword, role: 'Electrical Supervisor', department: 'Electrical' },
      { name: 'Suresh (Alpha Engineer)', email: 'field@lumisafe.ai', password: defaultPassword, role: 'Field Engineer', department: 'Electrical' },
      { name: 'Rajesh (Beta Engineer)', email: 'beta@lumisafe.ai', password: defaultPassword, role: 'Field Engineer', department: 'Electrical' },
      { name: 'City Ops Center', email: 'ops@lumisafe.ai', password: defaultPassword, role: 'City Operations', department: 'Operations' },
      { name: 'Inspector Raj', email: 'police@lumisafe.ai', password: defaultPassword, role: 'Police', department: 'Police' },
      { name: 'Public Guest', email: 'citizen@lumisafe.ai', password: defaultPassword, role: 'Public' },
      { name: 'System Admin', email: 'admin@lumisafe.ai', password: defaultPassword, role: 'Admin' }
    ];

    const createdUsers = await User.insertMany(users);
    
    // Create Teams
    const alphaEng = createdUsers.find(u => u.name.includes('Alpha'));
    const betaEng = createdUsers.find(u => u.name.includes('Beta'));

    await RepairTeam.insertMany([
      {
        name: 'Alpha Team',
        members: [alphaEng._id],
        status: 'AVAILABLE',
        currentLocation: { type: 'Point', coordinates: [83.315, 17.725] },
        inventory: ['LED Lamp (120W)', 'Waterproof Seal', 'Wiring Kit']
      },
      {
        name: 'Beta Team',
        members: [betaEng._id],
        status: 'AVAILABLE',
        currentLocation: { type: 'Point', coordinates: [83.29, 17.70] },
        inventory: ['Fuse Box', 'LED Lamp (60W)', 'Cable']
      }
    ]);

    logger.info(`[Seeder] Seeded ${users.length} default users and 2 Repair Teams.`);
  } catch (err) {
    logger.error(`[Seeder] Failed to seed data: ${err.message}`);
  }
};
