import { v4 as uuidv4 } from 'uuid';

export const correlationMiddleware = (req, res, next) => {
  req.id = req.headers['x-correlation-id'] || uuidv4();
  res.setHeader('x-correlation-id', req.id);
  next();
};
