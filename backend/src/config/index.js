import dotenv from 'dotenv';
dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  
  database: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/lumisafe'
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'lumi-dev-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'lumi-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },

  socket: {
    corsOrigin: process.env.CORS_ORIGIN || '*'
  },

  storage: {
    provider: process.env.STORAGE_PROVIDER || 'local',
    cloudinaryUrl: process.env.CLOUDINARY_URL
  },

  ai: {
    confidenceThreshold: 85,
    geminiApiKey: process.env.GEMINI_API_KEY
  }
};

export default config;
