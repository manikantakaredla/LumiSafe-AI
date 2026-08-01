import jwt from 'jsonwebtoken';
import { User } from '../../models/User.js';
import config from '../../config/index.js';
import { AppError } from '../../middleware/errorHandler.js';

class AuthController {
  async register(req, res, next) {
    try {
      const { name, email, password, role, department } = req.body;

      if (!name || !email || !password) {
        return next(new AppError('Please provide name, email, and password', 400));
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(new AppError('An account with this email already exists in GVMC database', 409));
      }

      // Pre-save hook in User model will automatically bcrypt hash the password
      const user = await User.create({
        name,
        email,
        password,
        role: role || 'Public',
        department: department || 'General'
      });

      const token = jwt.sign(
        { id: user._id, role: user.role, name: user.name },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      res.status(201).json({
        success: true,
        message: 'Registration successful',
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

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new AppError('Please provide both email and password', 400));
      }

      const user = await User.findOne({ email, isDeleted: false });
      if (!user) {
        return next(new AppError('Invalid email or password. Authentication denied.', 401));
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return next(new AppError('Invalid email or password. Authentication denied.', 401));
      }

      const token = jwt.sign(
        { id: user._id, role: user.role, name: user.name },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      res.status(200).json({
        success: true,
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
        return next(new AppError('User not found in system', 404));
      }
      res.status(200).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
