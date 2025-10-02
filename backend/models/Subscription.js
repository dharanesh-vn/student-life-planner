const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: [true, 'Please add a subscription name'],
    trim: true,
  },
  monthlyCost: {
    type: Number,
    required: [true, 'Please add a monthly cost'],
  },
  billingDate: {
    type: Number, // Storing the day of the month, e.g., 1, 15, 30
    required: [true, 'Please add a billing day (1-31)'],
    min: 1,
    max: 31,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);