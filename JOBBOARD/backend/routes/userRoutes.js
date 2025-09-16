import express from 'express';
import auth from '../middlewares/auth.js';
import {
  getProfile,
  updateProfile,
  getAllJobs,
  applyJob
} from '../controllers/userController.js';

const router = express.Router();

// @route   GET api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, getProfile);

// @route   PUT api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, updateProfile);

// @route   GET api/user/jobs
// @desc    Get all jobs
// @access  Private
router.get('/jobs', auth, getAllJobs);

// @route   POST api/user/apply
// @desc    Apply for a job
// @access  Private
router.post('/apply', auth, applyJob);

export default router;