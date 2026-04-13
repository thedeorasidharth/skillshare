const Session = require('../models/Session');
const crypto = require('crypto');

exports.requestSession = async (req, res) => {
  try {
    const { receiverId, dateTime } = req.body;
    
    if (!receiverId) {
      return res.status(400).json({ success: false, message: 'Receiver ID is required', data: null });
    }

    if (dateTime && new Date(dateTime) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Mastery scheduling requires a future coordinates. Cannot select past date/time.',
        data: null
      });
    }

    const currentUserId = req.user.userId;

    // --- Mock Data Fallback ---
    if (!req.dbConnected) {
      if (!req.mockStore.sessions) req.mockStore.sessions = [];
      const newSession = {
        _id: 'sess_' + Date.now(),
        senderId: { _id: currentUserId },
        receiverId: { _id: receiverId },
        users: [currentUserId, receiverId],
        status: 'pending',
        dateTime: dateTime || null,
        createdAt: new Date().toISOString()
      };
      
      req.mockStore.sessions.push(newSession);
      req.saveMockData();
      
      return res.status(201).json({
        success: true,
        message: 'Mock session request sent',
        data: newSession
      });
    }
    // --- End Mock Data Fallback ---

    const newSession = new Session({
      senderId: currentUserId,
      receiverId: receiverId,
      users: [currentUserId, receiverId],
      status: 'pending',
      dateTime
    });

    await newSession.save();
    res.status(201).json({
      success: true,
      message: 'Session request sent',
      data: newSession
    });
  } catch (error) {
    console.error('Request Session Error:', error);
    res.status(500).json({ success: false, message: 'Server error requesting session', data: null });
  }
};

exports.updateSessionStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'
    const { sessionId } = req.params;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status', data: null });
    }

    // --- Mock Data Fallback ---
    if (!req.dbConnected) {
      const session = req.mockStore.sessions.find(s => s._id === sessionId);
      if (!session) return res.status(404).json({ success: false, message: 'Session not found (Mock Mode)', data: null });
      
      const sessionReceiverId = session.receiverId?._id || session.receiverId || session.receiver?._id || session.receiver;
      if (sessionReceiverId !== req.user.userId) {
        return res.status(403).json({ success: false, message: 'Only the receiver can accept/reject', data: null });
      }

      session.status = status;
      if (status === 'accepted' && !session.meetingLink) {
        const randomId = crypto.randomBytes(8).toString('hex');
        session.meetingLink = `https://meet.jit.si/skillswap-${randomId}`;
      }
      
      req.saveMockData();
      return res.json({
        success: true,
        message: `Session ${status}`,
        data: session
      });
    }
    // --- End Mock Data Fallback ---

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found', data: null });

    if (session.receiverId.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Only the receiver can accept/reject', data: null });
    }

    session.status = status;
    if (status === 'accepted' && !session.meetingLink) {
      const randomId = crypto.randomBytes(8).toString('hex');
      session.meetingLink = `https://meet.jit.si/skillswap-${randomId}`;
    }

    await session.save();
    res.json({
      success: true,
      message: `Session ${status}`,
      data: session
    });
  } catch (error) {
    console.error('Update Session Error:', error);
    res.status(500).json({ success: false, message: 'Server error updating session', data: null });
  }
};

exports.getUserSessions = async (req, res) => {
  try {
    // --- Mock Data Fallback ---
    if (!req.dbConnected) {
      if (!req.mockStore.sessions) req.mockStore.sessions = [];
      
      const userSessions = req.mockStore.sessions
        .filter(s => {
          const sId = s.senderId?._id || s.senderId || s.requester?._id || s.requester;
          const rId = s.receiverId?._id || s.receiverId || s.receiver?._id || s.receiver;
          return sId === req.user.userId || rId === req.user.userId;
        })
        .map(s => {
          const sId = s.senderId?._id || s.senderId || s.requester?._id || s.requester;
          const rId = s.receiverId?._id || s.receiverId || s.receiver?._id || s.receiver;
          
          const senderId = req.mockStore.users.find(u => u._id === sId) || { _id: sId, name: 'User' };
          const receiverId = req.mockStore.users.find(u => u._id === rId) || { _id: rId, name: 'User' };
          
          return { ...s, senderId, receiverId };
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
      return res.json({
        success: true,
        message: 'Mock sessions fetched',
        data: userSessions
      });
    }
    // --- End Mock Data Fallback ---

    const sessions = await Session.find({ users: req.user.userId })
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Sessions fetched',
      data: sessions
    });
  } catch (error) {
    console.error('Get Sessions Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching sessions', data: null });
  }
};
