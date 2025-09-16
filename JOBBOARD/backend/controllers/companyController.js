import Company from '../models/Company.js';
import User from '../models/User.js';

export const getProfile = async (req, res) => {
  try {
    const company = await Company.findById(req.user.id).select('-password');
    res.json(company);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update company profile
export const updateProfile = async (req, res) => {
  const { name, description, location, website } = req.body;

  try {
    const company = await Company.findByIdAndUpdate(
      req.user.id,
      { name, description, location, website },
      { new: true }
    ).select('-password');

    res.json(company);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all jobs posted by the company
export const getJobs = async (req, res) => {
  try {
    const company = await Company.findById(req.user.id).select('jobs');
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company.jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};



// Post a new job
export const postJob = async (req, res) => {
  const { title, description, requirements, location, salary, type } = req.body;

  try {
    const company = await Company.findById(req.user.id);
    company.jobs.push({
      title,
      description,
      requirements,
      location,
      salary,
      type
    });
    await company.save();

    res.json(company.jobs[company.jobs.length - 1]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get applicants for a job
export const getApplicants = async (req, res) => {
  const { jobId } = req.params;

  try {
    const company = await Company.findById(req.user.id);
    const job = company.jobs.id(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Populate user details for each applicant
    const applicants = await Promise.all(
      job.applicants.map(async applicant => {
        const user = await User.findById(applicant.userId).select('name email skills experience education');
        return {
          userId: applicant.userId,
          status: applicant.status,
          appliedDate: applicant.appliedDate,
          userDetails: user
        };
      })
    );

    res.json({
      jobTitle: job.title,
      applicants
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};




// Update applicant status
export const updateApplicantStatus = async (req, res) => {
  const { jobId, userId, status } = req.body;

  try {
    // Update in company's job applicants
    const company = await Company.findOneAndUpdate(
      { _id: req.user.id, 'jobs._id': jobId, 'jobs.applicants.userId': userId },
      {
        $set: {
          'jobs.$.applicants.$[elem].status': status
        }
      },
      {
        arrayFilters: [{ 'elem.userId': userId }],
        new: true
      }
    );

    // Update in user's applications
    await User.findOneAndUpdate(
      { _id: userId, 'applications.jobId': jobId },
      {
        $set: {
          'applications.$.status': status
        }
      }
    );

    res.json({ message: 'Status updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};