const express = require('express');
const router = express.Router();
const { processNotesWithAI } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

// This single, protected route will handle all our AI actions.
router.post('/process-notes', protect, processNotesWithAI);

module.exports = router;