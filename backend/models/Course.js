const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  courseName: {
    type: String,
    required: [true, 'Please add a course name'],
    trim: true,
  },
  instructor: {
    type: String,
    trim: true,
  },
  // New structured format for schedule
  scheduleDays: {
    type: [String], // An array of strings like ['Monday', 'Wednesday']
    default: [],
  },
  scheduleStartTime: {
    type: String, // e.g., "10:00"
    trim: true,
  },
  scheduleEndTime: {
    type: String, // e.g., "11:00"
    trim: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Course', CourseSchema);