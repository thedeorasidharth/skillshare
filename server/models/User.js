const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  skillsTeach: [{ type: String }],
  skillsLearn: [{ type: String }],
  ratings: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  avgRating: { type: Number, default: 0 },
  lastActive: { type: Date },
  bio: { type: String, default: '' },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
