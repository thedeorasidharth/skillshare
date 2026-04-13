const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const User = require('../models/User');
const Message = require('../models/Message');
const Session = require('../models/Session');

const migrate = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not found in .env');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for migration...');

    const dataPath = path.join(__dirname, '../data.json');
    if (!fs.existsSync(dataPath)) {
      console.error('data.json not found');
      process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const idMap = {}; // mock_id -> new ObjectId

    // 1. Migrate Users
    console.log('--- Migrating Users ---');
    if (data.users && data.users.length > 0) {
      for (const u of data.users) {
        // Skip users with non-mock IDs that might already exist
        const newId = new mongoose.Types.ObjectId();
        idMap[u._id] = newId;

        const newUser = new User({
          ...u,
          _id: newId
        });
        await newUser.save();
        console.log(`Migrated user: ${u.name} (${u._id} -> ${newId})`);
      }
    }

    // 2. Migrate Messages
    console.log('--- Migrating Messages ---');
    if (data.messages && data.messages.length > 0) {
      for (const m of data.messages) {
        const newSender = idMap[m.sender];
        const newReceiver = idMap[m.receiver];

        if (newSender && newReceiver) {
          const newMessage = new Message({
            ...m,
            _id: new mongoose.Types.ObjectId(),
            sender: newSender,
            receiver: newReceiver
          });
          await newMessage.save();
          console.log(`Migrated message from ${m.sender} to ${m.receiver}`);
        } else {
          console.warn(`Skipping message ${m._id}: sender or receiver not found in mapping.`);
        }
      }
    }

    // 3. Migrate Sessions
    console.log('--- Migrating Sessions ---');
    if (data.sessions && data.sessions.length > 0) {
      for (const s of data.sessions) {
        // Handle both older and newer session formats
        const senderId = s.senderId?._id || s.requester?._id || s.users?.[0];
        const receiverId = s.receiverId?._id || s.receiver?._id || s.users?.[1];

        const newSender = idMap[senderId];
        const newReceiver = idMap[receiverId];

        if (newSender && newReceiver) {
          const newSession = new Session({
            ...s,
            _id: new mongoose.Types.ObjectId(),
            senderId: newSender,
            receiverId: newReceiver,
            users: [newSender, newReceiver]
          });
          await newSession.save();
          console.log(`Migrated session between ${senderId} and ${receiverId}`);
        } else {
          console.warn(`Skipping session ${s._id}: users not found in mapping.`);
        }
      }
    }

    console.log('\n✅ Migration complete! Your MongoDB Atlas cluster is now populated.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
};

migrate();
