import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';
import config from '../config/index.js';

export const protect = (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Not authorized to access this route', 401));
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded; // { id, role, name }
    next();
  } catch (err) {
    return next(new AppError('Token invalid or expired', 401));
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('User role not authorized to access this route', 403));
    }
    next();
  };
};
