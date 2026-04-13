const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const sessionController = require('../controllers/sessionController');

// @route   POST api/sessions/request
// @desc    Request a session
// @access  Private
router.post('/request', auth, sessionController.requestSession);

// @route   PUT api/sessions/update/:sessionId
// @desc    Accept/reject a session
// @access  Private
router.put('/update/:sessionId', auth, sessionController.updateSessionStatus);

// @route   GET api/sessions
// @desc    Get user sessions
// @access  Private
router.get('/', auth, sessionController.getUserSessions);

module.exports = router;
