const mongoose = require('mongoose');

// A sub-schema for individual schedule entries
const ScheduleItemSchema = new mongoose.Schema({
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
}, { _id: false });

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
  courseId: {
    type: String,
    trim: true,
  },
  instructor: {
    type: String,
    trim: true,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  schedule: [ScheduleItemSchema],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Course', CourseSchema);