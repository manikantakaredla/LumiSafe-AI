import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { seedUsers } from './seedUsers.js';

let mongoServer;

export const connectDB = async () => {
  try {
    const os = await import('os');
    const path = await import('path');
    const fs = await import('fs');
    
    // Create a persistent directory for MongoDB in the user's temp directory
    const dbPath = path.join(os.tmpdir(), 'lumisafe-mongo-db');
    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(dbPath, { recursive: true });
    }
    
    mongoServer = await MongoMemoryServer.create({
      instance: {
        dbPath,
        storageEngine: 'wiredTiger'
      }
    });
    const mongoUri = mongoServer.getUri();

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB In-Memory Connected: ${conn.connection.host}`);
    
    await seedUsers();
    
    const { seedAnalytics } = await import('./seedAnalytics.js');
    await seedAnalytics();
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};
