const express = require('express');
const router = express.Router();
const { 
  getAccounts, addAccount, deleteAccount,
  getTransactions, addTransaction, deleteTransaction,
  getSubscriptions, addSubscription, deleteSubscription
} = require('../controllers/financeController');
const { protect } = require('../middleware/auth');

// --- Finance Account Routes ---
router.route('/accounts')
  .get(protect, getAccounts)
  .post(protect, addAccount);
router.route('/accounts/:id')
  .delete(protect, deleteAccount);

// --- Transaction Routes ---
router.route('/transactions')
  .get(protect, getTransactions)
  .post(protect, addTransaction);
router.route('/transactions/:id')
  .delete(protect, deleteTransaction);

// --- Subscription Routes ---
router.route('/subscriptions')
  .get(protect, getSubscriptions)
  .post(protect, addSubscription);
router.route('/subscriptions/:id')
  .delete(protect, deleteSubscription);

module.exports = router;