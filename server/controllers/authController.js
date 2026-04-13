const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '2h' });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, skillsTeach, skillsLearn } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required', data: null });
    }

    const normalize = (skills) => {
      if (!skills) return [];
      const arr = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
      return [...new Set(arr.map(s => s.toLowerCase()).filter(s => s !== ""))];
    };

    const normalizedTeach = normalize(skillsTeach);
    const normalizedLearn = normalize(skillsLearn);

    // --- Mock Data Fallback ---
    if (!req.dbConnected) {
      const existingUser = req.mockStore.users.find(u => u.email === email);
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists (Mock Mode)', data: null });
      }

      const newUser = {
        _id: 'mock_' + Date.now(),
        name,
        email,
        password,
        skillsTeach: normalizedTeach,
        skillsLearn: normalizedLearn
      };
      
      newUser.lastActive = new Date().toISOString();
      req.mockStore.users.push(newUser);
      req.saveMockData();
      
      const token = generateToken(newUser._id);
      return res.status(201).json({
        success: true,
        message: 'Mock Sign up successful',
        data: {
          token,
          user: { id: newUser._id, name: newUser.name, email: newUser.email, skillsTeach: newUser.skillsTeach, skillsLearn: newUser.skillsLearn }
        }
      });
    }
    // --- End Mock Data Fallback ---

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists', data: null });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const now = new Date();

    user = new User({
      name,
      email,
      password: hashedPassword,
      skillsTeach: normalizedTeach,
      skillsLearn: normalizedLearn,
      lastActive: now
    });

    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      message: 'Sign up successful',
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, skillsTeach: user.skillsTeach, skillsLearn: user.skillsLearn }
      }
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ success: false, message: 'Server error during signup', data: null });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required', data: null });
    }

    // --- Mock Data Fallback ---
    if (!req.dbConnected) {
      const user = req.mockStore.users.find(u => u.email === email && u.password === password);
      if (user) {
        user.lastActive = new Date().toISOString();
        req.saveMockData();
        const token = generateToken(user._id);
        return res.json({
          success: true,
          message: 'Mock Login successful',
          data: {
            token,
            user: { id: user._id, name: user.name, email: user.email, skillsTeach: user.skillsTeach, skillsLearn: user.skillsLearn }
          }
        });
      }
      return res.status(400).json({ success: false, message: 'Invalid credentials (Mock Mode)', data: null });
    }
    // --- End Mock Data Fallback ---

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials', data: null });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials', data: null });
    }

    user.lastActive = new Date();
    await user.save();

    const token = generateToken(user._id);
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, skillsTeach: user.skillsTeach, skillsLearn: user.skillsLearn }
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during login', data: null });
  }
};
