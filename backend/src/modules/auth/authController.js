import jwt from 'jsonwebtoken';
import { User } from '../../models/User.js';
import config from '../../config/index.js';
import { AppError } from '../../middleware/errorHandler.js';

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      const user = await User.findOne({ email, isDeleted: false });
      if (!user) {
        return next(new AppError('Invalid credentials', 401));
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return next(new AppError('Invalid credentials', 401));
      }

      const token = jwt.sign(
        { id: user._id, role: user.role, name: user.name },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      res.status(200).json({
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department
          },
          token
        }
      });
    } catch (err) {
      next(err);
    }
  }

  async me(req, res, next) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return next(new AppError('User not found', 404));
      }
      res.status(200).json({ data: user });
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
