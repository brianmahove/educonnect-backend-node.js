const mongoose = require('mongoose');

const assignmentSchema = mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  submissionText: {
    type: String,
  },
  submissionFileUrl: {
    type: String, // URL to a submitted file (e.g., Google Drive, S3)
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  grade: {
    type: Number,
  },
  feedback: {
    type: String,
  },
});

module.exports = mongoose.model('Assignment', assignmentSchema);