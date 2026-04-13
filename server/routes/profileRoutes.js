const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const profileController = require('../controllers/profileController');

// @route   GET api/profile
// @desc    Get current user profile
// @access  Private
router.get('/', auth, profileController.getProfile);

// @route   PUT api/profile/skills
// @desc    Update user skills
// @access  Private
router.put('/skills', auth, profileController.updateSkills);

module.exports = router;
