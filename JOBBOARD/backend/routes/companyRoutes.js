import express from 'express';
import auth from '../middlewares/auth.js';
import {
  getProfile,
  updateProfile,
  getJobs,
  postJob,
  getApplicants,
  updateApplicantStatus
} from '../controllers/companyController.js';

const router = express.Router();

// @route   GET api/company/profile
// @desc    Get company profile
// @access  Private
router.get('/profile', auth, getProfile);

// @route   PUT api/company/profile
// @desc    Update company profile
// @access  Private
router.put('/profile', auth, updateProfile);

// @route   POST api/company/jobs
// @desc    Post a new job
// @access  Private
router.post('/jobs', auth, postJob);

// @route   GET api/company/jobs/:jobId/applicants
// @desc    Get applicants for a job
// @access  Private
router.get('/jobs/:jobId/applicants', auth, getApplicants);

// @route   PUT api/company/applicants/status
// @desc    Update applicant status
// @access  Private
router.put('/applicants/status', auth, updateApplicantStatus);
router.get('/jobs', auth, getJobs);


export default router;