import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';
import Profile from '../models/Profile.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { name, email, password, gender, dob } = req.body;
  console.log('📥 Signup attempt:', email);

  try {
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = new User({
      name,
      email: email.trim().toLowerCase(),
      password, // ✅ raw password — schema will hash it
      gender,
      dob,
      role: 'student',
    });

    await user.save();

    // ✅ Profile creation logic added
    const profile = new Profile({
      user: user._id,
      avatar: '',
      joined: new Date(),
    });

    await profile.save();

    res.status(201).json({
      message: 'User created successfully',
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('❌ Signup error:', err);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// 🔐 Login route
router.post('/login', async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const password = (req.body.password || '').trim();
    console.log('🔐 Login attempt:', email);

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // ✅ set to true in production with HTTPS
      sameSite: 'lax',
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'student', // ✅ include role for frontend redirect
      },
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// 👤 Get current user
router.get('/me', protect, async (req, res) => {
  try {
    const { id: _id, name, email, role } = req.user;

    const profile = await Profile.findOne({ user: _id });

    res.json({
      name,
      email,
      role: role || 'student',
      avatar: profile?.avatar || '',
      joined: profile?.joined || null,
    });
  } catch (err) {
    console.error('❌ /me error:', err);
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
});



export default router;
