import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js'; // adjust path if needed

dotenv.config({ path: '../.env' });

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ Connection error:', err.message);
    process.exit(1);
  });

const insertUsers = async () => {
  try {
    const adminEmail = 'admin@example.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        dob: new Date('1990-01-01'), // or any valid date
        gender: 'male',              // or 'female', 'other', etc.
      });

      console.log('✅ Admin inserted');
    } else {
      console.log('⚠️ Admin already exists');
    }
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
  } finally {
    mongoose.disconnect();
  }
};

insertUsers();
