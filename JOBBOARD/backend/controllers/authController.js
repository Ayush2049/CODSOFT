import User from '../models/User.js';
import Company from '../models/Company.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Common login function
const login = async (req, res, model, userType) => {
  const { email, password } = req.body;

  try {
    // Find entity by email
    const entity = await model.findOne({ email });
    if (!entity) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, entity.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: entity._id,
        type: userType
      }
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'ayush_backend9691',
      { expiresIn: '5d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          token,
          userType
        });
      }
    );
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Company login
export const companyLogin = async (req, res) => {
  await login(req, res, Company, 'company');
};

// User login
export const userLogin = async (req, res) => {
  await login(req, res, User, 'user');
};

// Common register function
const register = async (req, res, model, userType) => {
  const { name, email, password } = req.body;

  try {
    let user = await model.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    user = new model({
      name,
      email,
      password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
        type: userType
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'ayush_backend9691',
      { expiresIn: '5d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          token,
          userType
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// User registration
export const userRegister = async (req, res) => {
  await register(req, res, User, 'user');
};

// Company registration
export const companyRegister = async (req, res) => {
  await register(req, res, Company, 'company');
};

// Get current user (simplified version)
export const getCurrentUser = async (req, res) => {
  try {
    // The auth middleware already attached the user to req.user
    const userData = {
      ...req.user._doc,
      userType: req.userType // From your middleware
    };

    res.json({
      success: true,
      ...userData
    });
  } catch (err) {
    console.error('Get current user error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};