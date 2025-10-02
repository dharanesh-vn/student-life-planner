const FinanceAccount = require('../models/FinanceAccount');
const Transaction = require('../models/Transaction');
const Subscription = require('../models/Subscription');

// --- FINANCE ACCOUNT CONTROLLERS ---
exports.getAccounts = async (req, res) => {
  try {
    const accounts = await FinanceAccount.find({ user: req.user.id }).sort({ createdAt: 1 });
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.addAccount = async (req, res) => {
  try {
    const { accountName, balance } = req.body;
    const account = new FinanceAccount({ user: req.user.id, accountName, balance });
    const createdAccount = await account.save();
    res.status(201).json(createdAccount);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.deleteAccount = async (req, res) => {
  try {
    const account = await FinanceAccount.findOne({ _id: req.params.id, user: req.user.id });
    if (!account) return res.status(404).json({ message: 'Account not found' });
    // Also delete all associated transactions
    await Transaction.deleteMany({ account: req.params.id, user: req.user.id });
    await account.deleteOne();
    res.status(200).json({ message: 'Account and associated transactions removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- TRANSACTION CONTROLLERS ---
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .populate('account', 'accountName')
      .sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.addTransaction = async (req, res) => {
  try {
    const { description, amount, type, date, account: accountId } = req.body;
    const account = await FinanceAccount.findById(accountId);
    if (!account || account.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Associated account not found' });
    }
    // Create the transaction
    const transaction = new Transaction({ user: req.user.id, description, amount, type, date, account: accountId });
    const createdTransaction = await transaction.save();
    // Update the account balance
    if (type === 'Income') {
      account.balance += amount;
    } else { // Expense
      account.balance -= amount;
    }
    await account.save();
    await createdTransaction.populate('account', 'accountName');
    res.status(201).json(createdTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user.id });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    const account = await FinanceAccount.findById(transaction.account);
    if (account) {
      // Revert the balance change
      if (transaction.type === 'Income') {
        account.balance -= transaction.amount;
      } else { // Expense
        account.balance += transaction.amount;
      }
      await account.save();
    }
    await transaction.deleteOne();
    res.status(200).json({ message: 'Transaction removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- SUBSCRIPTION CONTROLLERS ---
exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user.id }).sort({ billingDate: 1 });
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.addSubscription = async (req, res) => {
  try {
    const { name, monthlyCost, billingDate } = req.body;
    const subscription = new Subscription({ user: req.user.id, name, monthlyCost, billingDate });
    const createdSubscription = await subscription.save();
    res.status(201).json(createdSubscription);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ _id: req.params.id, user: req.user.id });
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
    await subscription.deleteOne();
    res.status(200).json({ message: 'Subscription removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};