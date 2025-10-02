const express = require('express');
const router = express.Router();
const { 
  getCourses, addCourse, updateCourse, deleteCourse,
  getAssignments, addAssignment, updateAssignment, deleteAssignment,
  getNotesForCourse, addNote, updateNote, deleteNote
} = require('../controllers/academicController');
const { protect } = require('../middleware/auth');

// Course Routes
router.route('/courses').get(protect, getCourses).post(protect, addCourse);
router.route('/courses/:id').put(protect, updateCourse).delete(protect, deleteCourse);

// Assignment Routes
router.route('/assignments').get(protect, getAssignments).post(protect, addAssignment);
router.route('/assignments/:id').put(protect, updateAssignment).delete(protect, deleteAssignment);

// Note Routes
router.route('/courses/:courseId/notes').get(protect, getNotesForCourse);
router.route('/notes').post(protect, addNote);
router.route('/notes/:noteId').put(protect, updateNote).delete(protect, deleteNote);

module.exports = router;