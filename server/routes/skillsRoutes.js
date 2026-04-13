const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const skillsController = require('../controllers/skillsController');

// @route   GET api/skills/popular
// @desc    Get popular skills
// @access  Private
router.get('/popular', auth, skillsController.getPopularSkills);

// @route   GET api/skills/related
// @desc    Get related skills
// @access  Private
router.get('/related', auth, skillsController.getRelatedSkills);

// @route   POST api/skills/smart-suggest
// @desc    Get AI-like smart recommendations based on user selections
// @access  Private
router.post('/smart-suggest', auth, skillsController.smartSuggestSkills);

// @route   POST api/skills/search
// @desc    Search skills
// @access  Private
router.post('/search', auth, skillsController.searchSkills);

module.exports = router;
