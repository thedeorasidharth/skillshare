const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: function() { return this.messageType === 'text'; } },
  messageType: { type: String, enum: ['text', 'file'], default: 'text' },
  fileUrl: { type: String },
  fileName: { type: String },
  fileType: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
