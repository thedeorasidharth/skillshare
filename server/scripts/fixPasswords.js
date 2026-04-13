const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('../models/User');

const fixPasswords = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB for password fix...');

        const users = await User.find({});
        console.log(`Found ${users.length} users. Checking for plain text passwords...`);

        let fixedCount = 0;
        for (const user of users) {
            // bCrypt hashes usually start with $2a$, $2b$, or $2y$
            if (!user.password.startsWith('$2')) {
                console.log(`Hashing password for: ${user.email}`);
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
                await user.save();
                fixedCount++;
            }
        }

        console.log(`\n✅ Finished! Fixed ${fixedCount} plain text passwords.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Fix failed:', err);
        process.exit(1);
    }
};

fixPasswords();
