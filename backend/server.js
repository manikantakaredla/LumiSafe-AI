import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import { initSocketGateway } from './src/sockets/socketGateway.js';
import { initializeAIEngines } from './src/engine/index.js';

// Import Routes
import complaintRoutes from './src/modules/complaints/complaint.routes.js';
import evidenceRoutes from './src/modules/evidence/evidence.routes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Initialize Socket.IO
initSocketGateway(server);

// Routes
app.use('/api/complaints', complaintRoutes);
app.use('/api/evidence', evidenceRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'LumiSafe AI Backend Operational' });
});

// Start Server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  initializeAIEngines();
  server.listen(PORT, () => {
    console.log(`[SERVER] Running on port ${PORT}`);
  });
});
