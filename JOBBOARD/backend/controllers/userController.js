import User from '../models/User.js';
import Company from '../models/Company.js';

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  const { name, skills, experience, education } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, skills, experience, education },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Apply for a job
export const applyJob = async (req, res) => {
  const { jobId, companyId } = req.body;

  try {
    // Check if user already applied
    const user = await User.findById(req.user.id);
    const alreadyApplied = user.applications.some(
      app => app.jobId.toString() === jobId
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Add to user's applications
    user.applications.push({
      jobId,
      companyId,
      status: 'applied'
    });
    await user.save();

    // Add to company's applicants
    await Company.findOneAndUpdate(
      { _id: companyId, 'jobs._id': jobId },
      {
        $push: {
          'jobs.$.applicants': {
            userId: req.user.id,
            status: 'applied'
          }
        }
      }
    );

    res.json({ message: 'Application submitted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const companies = await Company.find({}, 'name jobs');
    let allJobs = [];

    companies.forEach(company => {
      company.jobs.forEach(job => {
        allJobs.push({
          jobId: job._id,
          companyId: company._id,
          companyName: company.name,
          title: job.title,
          description: job.description,
          location: job.location,
          salary: job.salary,
          type: job.type
        });
      });
    });

    res.json(allJobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};