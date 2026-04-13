const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// --- Public Routes ---
// @route   GET api/users/random
router.get('/random', userController.getRandomUsers);

// --- Private Routes (Ordered to prevent shadowing) ---
// @route   GET api/users/search
router.get('/search', auth, userController.searchUsers);

// @route   GET api/users/bookmarks
router.get('/bookmarks', auth, userController.getBookmarks);

// --- Parameter Routes (MUST BE LAST) ---
// @route   GET api/users/:userId
router.get('/:userId', userController.getUserById);

// --- Action Routes ---
// @route   POST api/users/review/add
router.post('/review/add', auth, userController.addReview);

// @route   POST api/users/ping
router.post('/ping', auth, userController.ping);

// @route   POST api/users/bookmark/toggle
router.post('/bookmark/toggle', auth, userController.toggleBookmark);

module.exports = router;
