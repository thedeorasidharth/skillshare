const User = require('../models/User');

exports.getMatches = async (req, res) => {
  try {
    let currentUser;
    let candidates = [];

    // 1. SAFE RETRIEVAL OF CURRENT USER
    if (!req.dbConnected) {
      currentUser = req.mockStore.users.find(u => u._id === req.user.userId);
      if (!currentUser) {
        return res.status(404).json({ success: false, message: 'User not found (Mock Mode)', data: null });
      }
      candidates = req.mockStore.users;
    } else {
      currentUser = await User.findById(req.user.userId);
      if (!currentUser) {
        return res.status(404).json({ success: false, message: 'User not found', data: null });
      }
      candidates = await User.find({ _id: { $ne: currentUser._id } }).select('-password');
    }

    // Normalize currentUser skills
    const myTeach = (currentUser.skillsTeach || []).map(s => s.toLowerCase().trim());
    const myLearn = (currentUser.skillsLearn || []).map(s => s.toLowerCase().trim());

    // 2. BIDIRECTIONAL MATCH LOGIC
    const matches = candidates
      .filter(otherUser => {
        // 3. REMOVE SELF USER
        if (otherUser._id.toString() === currentUser._id.toString()) return false;
        
        const theyTeach = (otherUser.skillsTeach || []).map(s => s.toLowerCase().trim());
        const theyLearn = (otherUser.skillsLearn || []).map(s => s.toLowerCase().trim());

        // Basic presence check
        if (theyTeach.length === 0 || theyLearn.length === 0) return false;

        // User A teaches what User B wants
        const iTeachWhatTheyLearn = myTeach.some(s => theyLearn.includes(s));
        // User B teaches what User A wants
        const theyTeachWhatILearn = theyTeach.some(s => myLearn.includes(s));
        
        return iTeachWhatTheyLearn && theyTeachWhatILearn;
      })
      .map(otherUser => {
        const theyTeach = (otherUser.skillsTeach || []).map(s => s.toLowerCase().trim());
        const theyLearn = (otherUser.skillsLearn || []).map(s => s.toLowerCase().trim());

        const overlapLearn = theyTeach.filter(s => myLearn.includes(s)).length;
        const overlapTeach = myTeach.filter(s => theyLearn.includes(s)).length;
        
        const formattedUser = otherUser.toObject ? otherUser.toObject() : { ...otherUser };
        return {
          ...formattedUser,
          matchScore: overlapLearn + overlapTeach
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    // 4. RESPONSE FORMAT (VERY IMPORTANT)
    res.json({
      success: true,
      message: `Successfully calculated ${matches.length} peer matches.`,
      data: matches
    });

  } catch (error) {
    // 5. ERROR HANDLING
    console.error('Match System Error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Match calculation failed", 
      data: [] 
    });
  }
};
