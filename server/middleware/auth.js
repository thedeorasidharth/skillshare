const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = function (req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ success: false, message: 'Access denied. No token provided.', data: null });

  try {
    const tokenString = token.replace('Bearer ', '');
    const decoded = jwt.verify(tokenString, process.env.JWT_SECRET || 'supersecretjwtkey_12345');
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ success: false, message: 'Invalid token.', data: null });
  }
};
