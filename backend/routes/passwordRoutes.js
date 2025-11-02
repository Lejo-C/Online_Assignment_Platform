import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { sendResetEmail } from '../utils/sendEmail.js';

const router = express.Router();

// 🔁 Step 1: Request reset
router.post('/forgot', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    const link = `https://online-assignment-platform.onrender.com/reset-password/${token}`;
    await sendResetEmail(email, link);

    res.json({ message: 'Reset link sent to email' });
  } catch (err) {
    console.error('❌ Forgot password error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 🔍 Step 2: Verify token
router.get('/verify/:token', async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

  res.json({ message: 'Token valid' });
});

// 🔐 Step 3: Reset password
router.post('/reset/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

  user.password = password; // ✅ triggers pre-save hook to hash
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  
  await user.save();
  

  res.json({ message: 'Password reset successful' });
});

export default router;
