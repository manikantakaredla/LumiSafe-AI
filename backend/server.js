import express from 'express';
import http from 'http';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import config from './src/config/index.js';
import { connectDB } from './src/config/db.js';
import { initSocketGateway } from './src/sockets/socketGateway.js';
import { initializeAIEngines } from './src/engine/index.js';

// Middlewares
import { setupSecurity, apiLimiter } from './src/middleware/security.js';
import { correlationMiddleware } from './src/middleware/correlationMiddleware.js';
import { responseHandler } from './src/middleware/responseHandler.js';
import { globalErrorHandler } from './src/middleware/errorHandler.js';

// Routes
import complaintRoutes from './src/modules/complaints/complaint.routes.js';
import evidenceRoutes from './src/modules/evidence/evidence.routes.js';

const app = express();
const server = http.createServer(app);

// 1. Security & Core Middleware
setupSecurity(app);
app.use(cors());
app.use(express.json());
app.use(correlationMiddleware);
app.use(responseHandler); // standardize responses
app.use(morgan('dev'));   // Logging

// Initialize Socket.IO
initSocketGateway(server);

// Swagger Documentation
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// V1 API Routes with Rate Limiting
app.use('/api/v1', apiLimiter);
app.use('/api/v1/complaints', complaintRoutes);
app.use('/api/v1/evidence', evidenceRoutes);

// Health Monitoring Endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'Operational',
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    version: '1.0.0'
  });
});

// Global Error Handler
app.use(globalErrorHandler);

// Start Server
connectDB().then(() => {
  initializeAIEngines();
  server.listen(config.port, () => {
    console.log(`[SERVER] Running on port ${config.port} | API Docs at /api-docs`);
  });
});
