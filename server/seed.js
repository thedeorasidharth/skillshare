const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

const seedUsers = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'password123',
    skillsTeach: ['React', 'JavaScript', 'Tailwind CSS'],
    skillsLearn: ['Python', 'Machine Learning']
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: 'password123',
    skillsTeach: ['Python', 'Django', 'PostgreSQL'],
    skillsLearn: ['React', 'UI/UX Design']
  },
  {
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    password: 'password123',
    skillsTeach: ['Graphic Design', 'Figma', 'Illustrator'],
    skillsLearn: ['Frontend Development', 'JavaScript']
  },
  {
    name: 'Diana Prince',
    email: 'diana@example.com',
    password: 'password123',
    skillsTeach: ['Project Management', 'Agile', 'Scrum'],
    skillsLearn: ['Data Science', 'Python']
  },
  {
    name: 'Ethan Hunt',
    email: 'ethan@example.com',
    password: 'password123',
    skillsTeach: ['Cybersecurity', 'Linux', 'Network Security'],
    skillsLearn: ['Mobile Development', 'Swift']
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing users (optional, but good for a fresh start)
    await User.deleteMany({});
    console.log('Cleared existing users.');

    // Hash passwords and insert users
    const hashedUsers = await Promise.all(seedUsers.map(async (user) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      return { ...user, password: hashedPassword };
    }));

    await User.insertMany(hashedUsers);
    console.log('Dummy users seeded successfully!');

    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
