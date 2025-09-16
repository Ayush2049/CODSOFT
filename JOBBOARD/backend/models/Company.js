import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: [String],
  location: String,
  salary: String,
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship']
  },
  applicants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['applied', 'reviewed', 'selected', 'rejected'],
      default: 'applied'
    },
    appliedDate: {
      type: Date,
      default: Date.now
    }
  }]
});

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  description: String,
  location: String,
  website: String,
  jobs: [jobSchema]
}, { timestamps: true });

export default mongoose.model('Company', companySchema);