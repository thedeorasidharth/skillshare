const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const matchController = require('../controllers/matchController');

// @route   GET api/matches
// @desc    Get matches for the current user
// @access  Private
router.get('/', auth, matchController.getMatches);

module.exports = router;
