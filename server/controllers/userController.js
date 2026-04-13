const User = require('../models/User');

// @desc    Get random users for landing page preview
// @route   GET /api/users/random
// @access  Public
exports.getRandomUsers = async (req, res) => {
  try {
    // --- Mock Data Fallback ---
    if (!req.dbConnected) {
      const allUsers = req.mockStore.users || [];
      // Filter for users who have at least one skill to teach
      const withSkills = allUsers.filter(u => u.skillsTeach && u.skillsTeach.length > 0);
      
      // Shuffle and take 3
      const shuffled = [...withSkills].sort(() => 0.5 - Math.random());
      const randomUsers = shuffled.slice(0, 3).map(u => ({
        id: u._id,
        name: u.name,
        skillsTeach: u.skillsTeach,
        lastActive: u.lastActive
      }));

      return res.json({
        success: true,
        message: 'Random mock users fetched',
        data: randomUsers
      });
    }
    // --- End Mock Data Fallback ---

    // MongoDB Implementation
    // Fetch users with skillsTeach, project only necessary fields
    const users = await User.aggregate([
      { $match: { "skillsTeach.0": { $exists: true } } }, // Ensures array is not empty
      { $sample: { size: 3 } },
      { $project: { name: 1, skillsTeach: 1, lastActive: 1 } }
    ]);

    // Map _id to id for consistency if needed (aggregate returns _id)
    const formattedUsers = users.map(u => ({
      id: u._id,
      name: u.name,
      skillsTeach: u.skillsTeach,
      lastActive: u.lastActive
    }));

    res.json({
      success: true,
      message: 'Random users fetched',
      data: formattedUsers
    });
  } catch (error) {
    console.error('Get Random Users Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching random users', data: [] });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:userId
// @access  Public
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    // --- Mock Data Fallback ---
    if (!req.dbConnected) {
      const user = req.mockStore.users.find(u => u._id === userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found in mockStore', data: null });
      }
      return res.json({
        success: true,
        message: 'Mock user fetched',
        data: {
          id: user._id,
          name: user.name,
          skillsTeach: user.skillsTeach,
          skillsLearn: user.skillsLearn,
          ratings: user.ratings || [],
          avgRating: user.avgRating || 0,
          lastActive: user.lastActive
        }
      });
    }
    // --- End Mock Data Fallback ---

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found', data: null });
    }

    res.json({
      success: true,
      message: 'User fetched',
      data: {
        id: user._id,
        name: user.name,
        skillsTeach: user.skillsTeach,
        skillsLearn: user.skillsLearn,
        ratings: user.ratings || [],
        avgRating: user.avgRating || 0,
        lastActive: user.lastActive
      }
    });
  } catch (error) {
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Invalid User ID format', data: null });
    }
    console.error('Get User By ID Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching user', data: null });
  }
};

// @desc    Add review for a user
// @route   POST /api/users/review/add
// @access  Private
exports.addReview = async (req, res) => {
  try {
    const { receiverId, sessionId, rating, review } = req.body;
    
    if (!receiverId || !sessionId || !rating) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (!req.dbConnected) {
      // Mock data logic
      const receiver = req.mockStore.users.find(u => u._id === receiverId);
      if (!receiver) return res.status(404).json({ success: false, message: 'User not found' });
      
      if (!receiver.ratings) receiver.ratings = [];
      
      const alreadyReviewed = receiver.ratings.some(r => r.sessionId === sessionId && r.userId === req.user.userId);
      if (alreadyReviewed) {
        return res.status(400).json({ success: false, message: 'You have already reviewed this session' });
      }
      
      receiver.ratings.push({
        userId: req.user.userId,
        sessionId,
        rating: Number(rating),
        review,
        createdAt: new Date().toISOString()
      });
      
      const total = receiver.ratings.reduce((acc, r) => acc + r.rating, 0);
      receiver.avgRating = total / receiver.ratings.length;
      
      req.saveMockData();
      return res.json({ success: true, message: 'Review added (mock)', data: receiver });
    }

    // Real DB logic
    const user = await User.findById(receiverId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const alreadyReviewed = user.ratings.some(
      (r) => r.sessionId.toString() === sessionId && r.userId.toString() === req.user.userId
    );

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this session' });
    }

    user.ratings.push({
      userId: req.user.userId,
      sessionId,
      rating: Number(rating),
      review
    });

    const total = user.ratings.reduce((acc, r) => acc + r.rating, 0);
    user.avgRating = total / user.ratings.length;

    await user.save();

    res.json({ success: true, message: 'Review added successfully', data: user });
  } catch (error) {
    console.error('Add Review Error:', error);
    res.status(500).json({ success: false, message: 'Server error adding review' });
  }
};

// @desc    Ping to update lastActive
// @route   POST /api/users/ping
// @access  Private
exports.ping = async (req, res) => {
  try {
    const now = new Date();
    if (!req.dbConnected) {
      const user = req.mockStore.users.find(u => u._id === req.user.userId);
      if (user) {
        user.lastActive = now.toISOString();
        req.saveMockData();
      }
      return res.json({ success: true, message: 'Mock ping successful' });
    }

    await User.findByIdAndUpdate(req.user.userId, { lastActive: now });
    res.json({ success: true, message: 'Ping successful' });
  } catch (error) {
    console.error('Ping Error:', error);
    res.status(500).json({ success: false, message: 'Server error during ping' });
  }
};

// @desc    Toggle user bookmark
// @route   POST /api/users/bookmark/toggle
// @access  Private
exports.toggleBookmark = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    if (!targetUserId) {
      return res.status(400).json({ success: false, message: 'Target user ID is required' });
    }

    if (!req.dbConnected) {
      const user = req.mockStore.users.find(u => u._id === req.user.userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      
      if (!user.bookmarks) user.bookmarks = [];
      const index = user.bookmarks.indexOf(targetUserId);
      
      let message = '';
      if (index === -1) {
        user.bookmarks.push(targetUserId);
        message = 'User saved to bookmarks';
      } else {
        user.bookmarks.splice(index, 1);
        message = 'User removed from bookmarks';
      }
      
      req.saveMockData();
      return res.json({ success: true, message, data: user.bookmarks });
    }

    const user = await User.findById(req.user.userId);
    const index = user.bookmarks.indexOf(targetUserId);
    
    let message = '';
    if (index === -1) {
      user.bookmarks.push(targetUserId);
      message = 'User saved to bookmarks';
    } else {
      user.bookmarks.splice(index, 1);
      message = 'User removed from bookmarks';
    }
    
    await user.save();
    res.json({ success: true, message, data: user.bookmarks });
  } catch (error) {
    console.error('Toggle Bookmark Error:', error);
    res.status(500).json({ success: false, message: 'Server error toggling bookmark' });
  }
};

// @desc    Get bookmarked users
// @route   GET /api/users/bookmarks
// @access  Private
exports.getBookmarks = async (req, res) => {
  try {
    if (!req.dbConnected) {
      const currentUser = req.mockStore.users.find(u => u._id === req.user.userId);
      const bookmarks = currentUser?.bookmarks || [];
      const savedUsers = req.mockStore.users
        .filter(u => bookmarks.includes(u._id))
        .map(u => ({
          _id: u._id,
          name: u.name,
          skillsTeach: u.skillsTeach,
          lastActive: u.lastActive
        }));
        
      return res.json({ success: true, message: 'Mock bookmarks fetched', data: savedUsers });
    }

    const user = await User.findById(req.user.userId).populate('bookmarks', 'name skillsTeach lastActive');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User session invalid', data: [] });
    }
    res.json({ success: true, message: 'Bookmarks fetched', data: user.bookmarks || [] });
  } catch (error) {
    console.error('Get Bookmarks Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching bookmarks', data: [] });
  }
};

// @desc    Search users by name or skills
// @route   GET /api/users/search
// @access  Private
exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json({ success: true, data: [] });
    }

    const query = q.toLowerCase().trim();

    if (!req.dbConnected) {
      const results = req.mockStore.users.filter(u => 
        u.name.toLowerCase().includes(query) ||
        (u.skillsTeach || []).some(s => s.toLowerCase().includes(query)) ||
        (u.skillsLearn || []).some(s => s.toLowerCase().includes(query))
      ).map(u => ({
        _id: u._id,
        name: u.name,
        skillsTeach: u.skillsTeach,
        lastActive: u.lastActive
      }));
      return res.json({ success: true, message: 'Mock search results', data: results });
    }

    const results = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { skillsTeach: { $regex: query, $options: 'i' } },
        { skillsLearn: { $regex: query, $options: 'i' } }
      ]
    }).select('name skillsTeach lastActive').limit(10);

    res.json({ success: true, message: 'Search results fetched', data: results });
  } catch (error) {
    console.error('Search Users Error:', error);
    res.status(500).json({ success: false, message: 'Server error during search', data: [] });
  }
};
