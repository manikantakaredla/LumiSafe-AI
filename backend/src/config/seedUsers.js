import { User } from '../models/User.js';
import { RepairTeam } from '../models/RepairTeam.js';
import logger from '../shared/logger.js';
import bcrypt from 'bcrypt';

export const seedUsers = async () => {
  try {
    // We wipe Users and Teams during seeding to ensure password hashes and role permissions are 100% accurate
    await User.deleteMany({});
    await RepairTeam.deleteMany({});

    const defaultPassword = 'password123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    
    const usersData = [
      { 
        name: 'Dr. A. Mallikarjuna, IAS', 
        email: 'commissioner@gvmc.gov.in', 
        password: hashedPassword, 
        role: 'Commissioner', 
        department: 'Executive HQ - GVMC' 
      },
      { 
        name: 'K. Ramesh (Superintending Engineer)', 
        email: 'electrical.se@gvmc.gov.in', 
        password: hashedPassword, 
        role: 'Electrical Supervisor', 
        department: 'GVMC Electrical Engineering Dept' 
      },
      { 
        name: 'P. Suresh (Team Alpha Lead)', 
        email: 'alpha@gvmc.gov.in', 
        password: hashedPassword, 
        role: 'Field Engineer', 
        department: 'Electrical - Zone 2 East' 
      },
      { 
        name: 'M. Rajesh (Team Beta Lead)', 
        email: 'beta@gvmc.gov.in', 
        password: hashedPassword, 
        role: 'Field Engineer', 
        department: 'Electrical - Zone 4 West' 
      },
      { 
        name: 'V. Naresh (Team Gamma Lead)', 
        email: 'gamma@gvmc.gov.in', 
        password: hashedPassword, 
        role: 'Field Engineer', 
        department: 'Electrical - Gajuwaka Zone' 
      },
      { 
        name: 'GVMC Command & Control Centre (CCC)', 
        email: 'ccc.ops@gvmc.gov.in', 
        password: hashedPassword, 
        role: 'City Operations', 
        department: 'Smart City CCC' 
      },
      { 
        name: 'Sri Shanka Bratha Bagchi, IPS (CP Visakhapatnam)', 
        email: 'police.cp@gvmc.gov.in', 
        password: hashedPassword, 
        role: 'Police', 
        department: 'Visakhapatnam City Police' 
      },
      { 
        name: 'MVP Colony Police Station (SHO)', 
        email: 'mvpu.police@gvmc.gov.in', 
        password: hashedPassword, 
        role: 'Police', 
        department: 'Law & Order East' 
      },
      { 
        name: 'Citizen App Account (Sami Reddi)', 
        email: 'citizen@gmail.com', 
        password: hashedPassword, 
        role: 'Public', 
        department: 'Citizen' 
      }
    ];

    // Use insertMany with already hashed passwords for instant seeding
    const createdUsers = await User.insertMany(usersData);
    
    // Assign Field Engineers to specialized GVMC Repair Teams
    const alphaEng = createdUsers.find(u => u.name.includes('Alpha'));
    const betaEng = createdUsers.find(u => u.name.includes('Beta'));
    const gammaEng = createdUsers.find(u => u.name.includes('Gamma'));

    await RepairTeam.insertMany([
      {
        name: 'Alpha Team (East Zone & MVP Colony)',
        members: [alphaEng._id],
        status: 'AVAILABLE',
        currentLocation: { type: 'Point', coordinates: [83.3325, 17.7410] }, // MVP Colony near Beach Road
        inventory: ['120W LED Smart Luminaire', 'IoT Gateway Module', 'Armoured Aluminum Cable 10m', 'Waterproof Junction Box']
      },
      {
        name: 'Beta Team (Gajuwaka & Steel Plant Hub)',
        members: [betaEng._id],
        status: 'EN_ROUTE',
        currentLocation: { type: 'Point', coordinates: [83.2185, 17.6894] }, // Gajuwaka Junction
        inventory: ['60W LED Luminaire', 'MCB Switchboards', 'Overhead Line Connectors', 'Pole Clamp Sets']
      },
      {
        name: 'Gamma Team (Madhurawada & IT SEZ)',
        members: [gammaEng._id],
        status: 'AVAILABLE',
        currentLocation: { type: 'Point', coordinates: [83.3752, 17.8185] }, // Madhurawada Near Rushikonda
        inventory: ['250W High Mast Floodlight', 'IoT Photocell Controller', 'Copper Earth Wire', 'Insulated Gloves & Toolkit']
      }
    ]);

    logger.info(`[Seeder] Successfully seeded ${createdUsers.length} GVMC official accounts and 3 specialized Repair Teams with bcrypt hashed credentials.`);
  } catch (err) {
    logger.error(`[Seeder] Failed to seed users: ${err.message}`);
  }
};
