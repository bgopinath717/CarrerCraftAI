import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// Helper to extract token from headers or cookies
const extractToken = (req) => {
  // 1. Check Authorization Bearer header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.split(' ')[1];
  }
  // 2. Check Cookie header (e.g. token=...)
  if (req.headers.cookie) {
    const match = req.headers.cookie
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith('token='));
    if (match) {
      return match.split('=')[1];
    }
  }
  return null;
};

export const protect = async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please log in to continue.',
    });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'careercraft_production_jwt_secret_key_2026';
    const decoded = jwt.verify(token, jwtSecret);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Session invalid: User account not found.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication session expired or invalid. Please sign in again.',
    });
  }
};

// Optional authentication middleware for endpoints like ATS Checker
// that can be used by public visitors but also track history if logged in
export const optionalProtect = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return next();
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'careercraft_production_jwt_secret_key_2026';
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.user = user;
    }
  } catch (error) {
    // Ignore invalid token for optional auth
  }
  next();
};
