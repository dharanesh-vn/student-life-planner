const express = require('express');
const router = express.Router();
const { 
  getTasks, addTask, updateTask, deleteTask,
  getGoals, addGoal, updateGoal, deleteGoal
} = require('../controllers/planningController');
const { protect } = require('../middleware/auth');

// Task Routes
router.route('/tasks')
  .get(protect, getTasks)
  .post(protect, addTask);

router.route('/tasks/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

// Goal Routes
router.route('/goals')
  .get(protect, getGoals)
  .post(protect, addGoal);

router.route('/goals/:id')
  .put(protect, updateGoal)
  .delete(protect, deleteGoal);

module.exports = router;