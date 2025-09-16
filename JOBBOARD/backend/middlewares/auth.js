import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Company from '../models/Company.js';

const auth = async (req, res, next) => {
  // Get token from header

  console.log("Token received:", req.headers['x-auth-token']);
  console.log("Secret used:", process.env.JWT_SECRET);


  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authorization denied: No token provided'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ayush_backend9691');

    // Validate token structure
    if (!decoded?.user?.id || !decoded?.user?.type) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token structure'
      });
    }

    const { id, type } = decoded.user;

    // Find user based on type
    let entity;
    switch (type) {
      case 'user':
        entity = await User.findById(id).select('-password');
        break;
      case 'company':
        entity = await Company.findById(id).select('-password');
        break;
      default:
        return res.status(401).json({
          success: false,
          message: 'Invalid account type specified'
        });
    }

    if (!entity) {
      return res.status(404).json({
        success: false,
        message: `${type.charAt(0).toUpperCase() + type.slice(1)} not found`
      });
    }

    // Attach to request
    req.user = entity;
    req.userType = type;
    next();
  } catch (err) {
    console.error('[Auth Middleware Error]:', err.message);

    // Specific error responses
    let message = 'Authentication failed';
    if (err.name === 'JsonWebTokenError') message = 'Invalid token';
    if (err.name === 'TokenExpiredError') message = 'Token expired';

    res.status(401).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};


export default auth;