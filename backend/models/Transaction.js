const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Please link a financial account'],
    ref: 'FinanceAccount',
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Please add a positive amount'],
  },
  type: {
    type: String,
    enum: ['Income', 'Expense'],
    required: [true, 'Please specify the transaction type'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Transaction', TransactionSchema);