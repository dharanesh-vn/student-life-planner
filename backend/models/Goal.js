const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: [true, 'Please add a goal title'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: ['Academic', 'Personal', 'Career', 'Health', 'Other'],
    default: 'Personal',
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Achieved'],
    default: 'Not Started',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Goal', GoalSchema);