import { User } from '../models/User.js';
import logger from '../shared/logger.js';

export const seedUsers = async () => {
  try {
    const count = await User.countDocuments();
    if (count > 0) {
      logger.info('[Seeder] Users already exist. Skipping seed.');
      return;
    }

    const defaultPassword = 'password123'; // Dummy password for hackathon
    
    const users = [
      { name: 'Dr. Hari', email: 'commissioner@lumisafe.ai', password: defaultPassword, role: 'Commissioner', department: 'Executive' },
      { name: 'Ramesh (Supervisor)', email: 'electrical@lumisafe.ai', password: defaultPassword, role: 'Electrical Supervisor', department: 'Electrical' },
      { name: 'Suresh (Field)', email: 'field@lumisafe.ai', password: defaultPassword, role: 'Field Engineer', department: 'Electrical' },
      { name: 'City Ops Center', email: 'ops@lumisafe.ai', password: defaultPassword, role: 'City Operations', department: 'Operations' },
      { name: 'Inspector Raj', email: 'police@lumisafe.ai', password: defaultPassword, role: 'Police', department: 'Police' },
      { name: 'Public Guest', email: 'citizen@lumisafe.ai', password: defaultPassword, role: 'Public' },
      { name: 'System Admin', email: 'admin@lumisafe.ai', password: defaultPassword, role: 'Admin' }
    ];

    await User.insertMany(users);
    logger.info(`[Seeder] Seeded ${users.length} default users with password: ${defaultPassword}`);
  } catch (err) {
    logger.error(`[Seeder] Failed to seed users: ${err.message}`);
  }
};
