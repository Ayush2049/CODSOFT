import express from 'express';
import {
  userRegister,
  companyRegister,
  userLogin,
  companyLogin,
  getCurrentUser
} from '../controllers/authController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// @route   POST api/auth/user/register
// @desc    Register user
// @access  Public
router.post('/user/register', userRegister);

// @route   POST api/auth/company/register
// @desc    Register company
// @access  Public
router.post('/company/register', companyRegister);

// @route   POST api/auth/user/login
// @desc    Login user & get token
// @access  Public
router.post('/user/login', userLogin);

// @route   POST api/auth/company/login
// @desc    Login company & get token
// @access  Public
router.post('/company/login', companyLogin);

// @route   GET api/auth
// @desc    Get current user/company
// @access  Private
router.get('/', auth, getCurrentUser);
router.get('/user', auth, getCurrentUser);
router.get('/company', auth, getCurrentUser);
export default router;