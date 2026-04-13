const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  }
});

// Socket.io Real-time Activity Handling
io.on('connection', (socket) => {
  socket.on('activity_ping', async ({ userId, dbConnected }) => {
    socket.join(userId);
    const now = new Date();
    // Broadcast status to anyone listening for this user's updates
    io.emit('user_status_update', { userId, lastActive: now });
    
    if (dbConnected) {
      if (mongoose.connection.readyState === 1) {
        const User = require('./models/User');
        User.findByIdAndUpdate(userId, { lastActive: now }).exec().catch(err => console.error(err));
      }
    }
  });
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: "SkillSwap API is running", 
    status: mongoose.connection.readyState === 1 ? "Connected to DB" : "Disconnected from DB" 
  });
});

// Mock Database Store for Offline Development
const fs = require('fs');
const path = require('path');
const dataFilePath = path.join(__dirname, 'data.json');

const defaultMockStore = {
  users: [
    { _id: 'mock_alice', name: 'Alice Johnson', email: 'alice@example.com', password: 'password123', skillsTeach: ['React', 'Node.js'], skillsLearn: ['Python', 'Design'] },
    { _id: 'mock_bob', name: 'Bob Smith', email: 'bob@example.com', password: 'password123', skillsTeach: ['Python', 'Data Science'], skillsLearn: ['React', 'Marketing'] },
    { _id: 'mock_charlie', name: 'Charlie Brown', email: 'charlie@example.com', password: 'password123', skillsTeach: ['UI/UX', 'Figma'], skillsLearn: ['Node.js', 'Typescript'] }
  ],
  messages: [],
  sessions: []
};

let mockStore = defaultMockStore;

if (fs.existsSync(dataFilePath)) {
  try {
    const rawData = fs.readFileSync(dataFilePath, 'utf8');
    mockStore = JSON.parse(rawData);
  } catch (err) {
    console.error('Failed to read data.json, using default mock data.');
  }
} else {
  fs.writeFileSync(dataFilePath, JSON.stringify(defaultMockStore, null, 2));
}

const saveMockData = () => {
  fs.writeFileSync(dataFilePath, JSON.stringify(mockStore, null, 2));
};

// Database connection
let dbConnected = false;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    dbConnected = true;
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️ Running in Mock Data Mode (No database connected)');
  });

// Inject db state and mockStore into req
app.use((req, res, next) => {
  req.dbConnected = dbConnected;
  req.mockStore = mockStore;
  req.saveMockData = saveMockData;
  next();
});

// Routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const matchRoutes = require('./routes/matchRoutes');
const chatRoutes = require('./routes/chatRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const aiRoutes = require('./routes/aiRoutes');
const skillsRoutes = require('./routes/skillsRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  
  if (err.name === 'MulterError') {
    return res.status(400).json({ 
      success: false, 
      message: `Upload error: ${err.message}`, 
      data: null 
    });
  }
  
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Internal server error', 
    data: null 
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
