const Task = require('../models/Task');
const Goal = require('../models/Goal');

// --- TASK CONTROLLERS ---
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ dueDate: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.addTask = async (req, res) => {
  try {
    const { title, dueDate } = req.body;
    if (!title || !dueDate) {
      return res.status(400).json({ message: 'Title and due date are required' });
    }
    const task = new Task({ user: req.user.id, title, dueDate, isCompleted: false });
    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.updateTask = async (req, res) => {
  try {
    const { title, dueDate, isCompleted } = req.body;
    let task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    task.title = title !== undefined ? title : task.title;
    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
    task.isCompleted = isCompleted !== undefined ? isCompleted : task.isCompleted;
    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    await task.deleteOne();
    res.status(200).json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- GOAL CONTROLLERS ---
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.addGoal = async (req, res) => {
  try {
    const { title, description, category, status } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    const goal = new Goal({ user: req.user.id, title, description, category, status });
    const createdGoal = await goal.save();
    res.status(201).json(createdGoal);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.updateGoal = async (req, res) => {
  try {
    const { title, description, category, status } = req.body;
    let goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    goal.title = title !== undefined ? title : goal.title;
    goal.description = description !== undefined ? description : goal.description;
    goal.category = category !== undefined ? category : goal.category;
    goal.status = status !== undefined ? status : goal.status;
    const updatedGoal = await goal.save();
    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    await goal.deleteOne();
    res.status(200).json({ message: 'Goal removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};