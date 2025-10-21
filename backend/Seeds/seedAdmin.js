import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js'; // adjust path if needed

mongoose.connect('mongodb://localhost:27017/examPlatform')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ Connection error:', err));

const insertUsers = async () => {
  // Insert Admin
  const adminEmail = 'admin@example.com';
  const adminExists = await User.findOne({ email: adminEmail });
  if (!adminExists) {
    const hashedAdmin = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: hashedAdmin,
      role: 'admin',
    });
    console.log('✅ Admin inserted');
  } else {
    console.log('⚠️ Admin already exists');
  }

  // Insert Proctor
  const proctorEmail = 'proctor@example.com';
  const proctorExists = await User.findOne({ email: proctorEmail });
  if (!proctorExists) {
    const hashedProctor = await bcrypt.hash('proctor123', 10);
    await User.create({
      name: 'Proctor',
      email: proctorEmail,
      password: hashedProctor,
      role: 'proctor',
    });
    console.log('✅ Proctor inserted');
  } else {
    console.log('⚠️ Proctor already exists');
  }

  mongoose.disconnect();
};

insertUsers();
