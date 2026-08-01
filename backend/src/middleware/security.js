import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import express from 'express';

// Standard rate limiter for all APIs
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100000, // Increased limit for real-time dashboard auto-refresh and testing
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiter for sensitive endpoints
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5000, 
  message: 'Too many sensitive requests from this IP.',
});

export const setupSecurity = (app) => {
  // Set security HTTP headers
  app.use(helmet());

  // Compress responses
  app.use(compression());

  // Limit request payload size
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
};
