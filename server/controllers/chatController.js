const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, text, messageType, fileUrl, fileName, fileType } = req.body;
    
    if (!receiverId) {
      return res.status(400).json({ success: false, message: 'Receiver ID is required', data: null });
    }

    const type = messageType || 'text';

    if (type === 'text' && !text) {
      return res.status(400).json({ success: false, message: 'Text is required for text messages', data: null });
    }

    // --- Mock Data Fallback ---
    if (!req.dbConnected) {
      if (!req.mockStore.messages) req.mockStore.messages = [];
      const newMessage = {
        _id: 'msg_' + Date.now(),
        sender: req.user.userId,
        receiver: receiverId,
        text: text || '',
        messageType: type,
        fileUrl: fileUrl || null,
        fileName: fileName || null,
        fileType: fileType || null,
        createdAt: new Date().toISOString()
      };
      
      
      const sender = req.mockStore.users.find(u => u._id === req.user.userId);
      if (sender) sender.lastActive = new Date().toISOString();
      
      req.mockStore.messages.push(newMessage);
      req.saveMockData();
      
      return res.status(201).json({
        success: true,
        message: 'Mock message sent',
        data: newMessage
      });
    }
    // --- End Mock Data Fallback ---

    const newMessage = new Message({
      sender: req.user.userId,
      receiver: receiverId,
      text: text || '',
      messageType: type,
      fileUrl: fileUrl || null,
      fileName: fileName || null,
      fileType: fileType || null
    });

    await newMessage.save();

    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user.userId, { lastActive: new Date() });
    
    res.status(201).json({
      success: true,
      message: 'Message sent',
      data: newMessage
    });
  } catch (error) {
    console.error('Send Message Error:', error);
    res.status(500).json({ success: false, message: 'Server error sending message', data: null });
  }
};

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded', data: null });
    }

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        fileUrl: `/uploads/${req.file.filename}`,
        fileName: req.file.originalname,
        fileType: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('File Upload Error:', error);
    res.status(500).json({ success: false, message: 'Server error uploading file', data: null });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const userId1 = req.user.userId;
    const userId2 = req.params.userId;

    if (!userId2) {
      return res.status(400).json({ success: false, message: 'Other user ID is required', data: null });
    }

    // --- Mock Data Fallback ---
    if (!req.dbConnected) {
      if (!req.mockStore.messages) req.mockStore.messages = [];
      
      const messages = req.mockStore.messages
        .filter(msg => 
          (msg.sender === userId1 && msg.receiver === userId2) ||
          (msg.sender === userId2 && msg.receiver === userId1)
        )
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        
      return res.json({
        success: true,
        message: 'Mock chat history fetched',
        data: messages
      });
    }
    // --- End Mock Data Fallback ---

    const messages = await Message.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 }
      ]
    }).sort({ createdAt: 1 });

    res.json({
      success: true,
      message: 'Chat history fetched',
      data: messages
    });
  } catch (error) {
    console.error('Get Chat History Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching chat history', data: null });
  }
};
