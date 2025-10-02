const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Note = require('../models/Note');

// --- COURSE CONTROLLERS ---
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching courses' });
  }
};
exports.addCourse = async (req, res) => {
  try {
    const { courseName, instructor, scheduleDays, scheduleStartTime, scheduleEndTime } = req.body;
    if (!courseName) {
      return res.status(400).json({ message: 'Course name is required' });
    }
    const course = new Course({ user: req.user.id, courseName, instructor, scheduleDays, scheduleStartTime, scheduleEndTime });
    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(500).json({ message: 'Server error adding course' });
  }
};
exports.updateCourse = async (req, res) => {
  try {
    const { courseName, instructor, scheduleDays, scheduleStartTime, scheduleEndTime } = req.body;
    let course = await Course.findOne({ _id: req.params.id, user: req.user.id });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    course.courseName = courseName !== undefined ? courseName : course.courseName;
    course.instructor = instructor !== undefined ? instructor : course.instructor;
    course.scheduleDays = scheduleDays !== undefined ? scheduleDays : course.scheduleDays;
    course.scheduleStartTime = scheduleStartTime !== undefined ? scheduleStartTime : course.scheduleStartTime;
    course.scheduleEndTime = scheduleEndTime !== undefined ? scheduleEndTime : course.scheduleEndTime;
    const updatedCourse = await course.save();
    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating course' });
  }
};
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, user: req.user.id });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    await Assignment.deleteMany({ course: req.params.id, user: req.user.id });
    await course.deleteOne();
    res.status(200).json({ message: 'Course and associated assignments removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting course' });
  }
};

// --- ASSIGNMENT CONTROLLERS ---
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ user: req.user.id }).populate('course', 'courseName').sort({ dueDate: 1 });
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching assignments' });
  }
};
exports.addAssignment = async (req, res) => {
  try {
    const { title, dueDate, status, course } = req.body;
    if (!title || !dueDate || !course) {
      return res.status(400).json({ message: 'Title, due date, and course are required' });
    }
    const assignment = new Assignment({ user: req.user.id, title, dueDate, status, course });
    const createdAssignment = await assignment.save();
    await createdAssignment.populate('course', 'courseName');
    res.status(201).json(createdAssignment);
  } catch (error) {
    res.status(500).json({ message: 'Server error adding assignment' });
  }
};
exports.updateAssignment = async (req, res) => {
  try {
    const { title, dueDate, status, course } = req.body;
    let assignment = await Assignment.findOne({ _id: req.params.id, user: req.user.id });
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    assignment.title = title !== undefined ? title : assignment.title;
    assignment.dueDate = dueDate !== undefined ? dueDate : assignment.dueDate;
    assignment.status = status !== undefined ? status : assignment.status;
    assignment.course = course !== undefined ? course : assignment.course;
    const updatedAssignment = await assignment.save();
    await updatedAssignment.populate('course', 'courseName');
    res.status(200).json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating assignment' });
  }
};
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findOne({ _id: req.params.id, user: req.user.id });
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    await assignment.deleteOne();
    res.status(200).json({ message: 'Assignment removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting assignment' });
  }
};

// --- NOTE CONTROLLERS ---
exports.getNotesForCourse = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id, course: req.params.courseId }).sort({ updatedAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching notes' });
  }
};
exports.addNote = async (req, res) => {
  try {
    const { title, content, course } = req.body;
    if (!title || !course) {
      return res.status(400).json({ message: 'Title and course are required' });
    }
    const note = new Note({ user: req.user.id, course, title, content });
    const createdNote = await note.save();
    res.status(201).json(createdNote);
  } catch (error) {
    res.status(500).json({ message: 'Server error adding note' });
  }
};
exports.updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    let note = await Note.findOne({ _id: req.params.noteId, user: req.user.id });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    note.title = title !== undefined ? title : note.title;
    note.content = content !== undefined ? content : note.content;
    const updatedNote = await note.save();
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating note' });
  }
};
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.noteId, user: req.user.id });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    await note.deleteOne();
    res.status(200).json({ message: 'Note removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting note' });
  }
};