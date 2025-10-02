const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Please link this assignment to a course'],
    ref: 'Course',
  },
  title: {
    type: String,
    required: [true, 'Please add an assignment title'],
    trim: true,
  },
  dueDate: {
    type: Date,
    required: [true, 'Please add a due date'],
  },
  status: {
    type: String,
    required: true,
    enum: ['To-Do', 'In Progress', 'Done'], // Only allows these values
    default: 'To-Do',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Assignment', AssignmentSchema);