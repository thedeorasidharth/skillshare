const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    // --- Mock Data Fallback ---
    if (!req.dbConnected) {
      const user = req.mockStore.users.find(u => u._id === req.user.userId);
      if (user) {
        return res.json({
          success: true,
          message: 'Mock profile fetched',
          data: user
        });
      }
      return res.status(404).json({ success: false, message: 'User not found (Mock Mode)', data: null });
    }
    // --- End Mock Data Fallback ---

    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found', data: null });
    }
    res.json({
      success: true,
      message: 'Profile fetched',
      data: user
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching profile', data: null });
  }
};

exports.updateSkills = async (req, res) => {
  try {
    const { skillsTeach, skillsLearn, bio } = req.body;

    const normalize = (skills) => {
      if (!skills) return [];
      const arr = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
      return [...new Set(arr.map(s => s.toLowerCase()).filter(s => s !== ""))];
    };

    const normalizedTeach = normalize(skillsTeach);
    const normalizedLearn = normalize(skillsLearn);

    // --- Mock Data Fallback ---
    if (!req.dbConnected) {
      const userIndex = req.mockStore.users.findIndex(u => u._id === req.user.userId);
      if (userIndex !== -1) {
        req.mockStore.users[userIndex].skillsTeach = normalizedTeach;
        req.mockStore.users[userIndex].skillsLearn = normalizedLearn;
        if (bio !== undefined) req.mockStore.users[userIndex].bio = bio;
        req.saveMockData();
        return res.json({
          success: true,
          message: 'Mock skills updated (normalized)',
          data: req.mockStore.users[userIndex]
        });
      }
      return res.status(404).json({ success: false, message: 'User not found (Mock Mode)', data: null });
    }
    // --- End Mock Data Fallback ---

    let user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found', data: null });
    }

    user.skillsTeach = normalizedTeach;
    user.skillsLearn = normalizedLearn;
    if (bio !== undefined) user.bio = bio;

    await user.save();
    res.json({
      success: true,
      message: 'Skills updated',
      data: user
    });
  } catch (error) {
    console.error('Update Skills Error:', error);
    res.status(500).json({ success: false, message: 'Server error updating skills', data: null });
  }
};
