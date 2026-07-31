import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { seedUsers } from './seedUsers.js';

let mongoServer;

export const connectDB = async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB In-Memory Connected: ${conn.connection.host}`);
    
    await seedUsers();
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};
