const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Keep for easy querying
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  meetingLink: { type: String },
  dateTime: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
