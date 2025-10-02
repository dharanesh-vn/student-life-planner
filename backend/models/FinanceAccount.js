const mongoose = require('mongoose');

const FinanceAccountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  accountName: {
    type: String,
    required: [true, 'Please add an account name'],
    trim: true,
  },
  balance: {
    type: Number,
    required: [true, 'Please add a starting balance'],
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('FinanceAccount', FinanceAccountSchema);