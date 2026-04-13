const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const chatController = require('../controllers/chatController');

// @route   POST api/chat/upload
// @desc    Upload a file
// @access  Private
router.post('/upload', auth, upload.single('file'), chatController.uploadFile);

// @route   POST api/chat/send
// @desc    Send a message
// @access  Private
router.post('/send', auth, chatController.sendMessage);

// @route   GET api/chat/history/:userId
// @desc    Get chat history with another user
// @access  Private
router.get('/history/:userId', auth, chatController.getChatHistory);

module.exports = router;
