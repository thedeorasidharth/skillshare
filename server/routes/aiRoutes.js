const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const aiController = require('../controllers/aiController');

// @route   POST api/ai/suggest
// @desc    Get skill suggestions
// @access  Private
router.post('/suggest', auth, aiController.suggestSkills);

module.exports = router;
