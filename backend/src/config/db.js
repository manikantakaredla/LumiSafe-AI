import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import config from './index.js';
import { seedUsers } from './seedUsers.js';

let mongoServer;

export const connectDB = async () => {
  try {
    let mongoUri = config.database.uri;

    // Check if the provided URI is an actual cloud/local URI and not a placeholder
    const isRealUri = process.env.MONGO_URI && 
                      !process.env.MONGO_URI.includes('<username>') && 
                      !process.env.MONGO_URI.includes('<password>');

    if (!isRealUri || process.env.USE_IN_MEMORY === 'true') {
      console.log('[Database] Using MongoMemoryServer as fallback...');
      const os = await import('os');
      const path = await import('path');
      const fs = await import('fs');
      
      const dbPath = path.join(os.tmpdir(), 'lumisafe-mongo-db');
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
      }
      
      mongoServer = await MongoMemoryServer.create({
        instance: { dbPath, storageEngine: 'wiredTiger' }
      });
      mongoUri = mongoServer.getUri();
    } else {
      console.log('[Database] Connecting to External MongoDB Provider...');
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}`);
    
    // Seed initial admin/test accounts if needed
    await seedUsers();
    
    // Seed rich analytics data for the dashboard
    const { seedAnalytics } = await import('./seedAnalytics.js');
    await seedAnalytics();

  } catch (error) {
    console.error(`[Database] MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};
