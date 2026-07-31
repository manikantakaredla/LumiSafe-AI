import logger from '../shared/logger.js';

export class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  logger.error(`[Error] ${err.message}`, { 
    correlationId: req.id, 
    stack: err.stack,
    url: req.originalUrl 
  });

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.isOperational ? err.message : 'Internal Server Error',
    errors: err.errors || [err.message]
  });
};
