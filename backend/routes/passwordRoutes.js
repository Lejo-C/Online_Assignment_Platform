import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { sendResetEmail } from '../utils/sendEmail.js';

const router = express.Router();

// 🔁 Step 1: Request password reset
router.post('/forgot', async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }

    console.log('🔍 Password reset requested for:', email);

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    // Security: Don't reveal if user exists or not
    if (!user) {
      console.log('⚠️ User not found, but sending generic response');
      return res.json({ 
        message: 'If an account exists with this email, you will receive a password reset link.' 
      });
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Hash token before storing (security best practice)
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    user.resetToken = hashedToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    console.log('✅ Reset token generated and saved');

    // Use frontend URL for the reset link
    const frontendUrl = process.env.FRONTEND_URL || 'https://online-assignment-platform.netlify.app';
    const resetLink = `${frontendUrl}/reset-password/${token}`;

    console.log('🔗 Reset link:', resetLink);

    // Send email
    await sendResetEmail(email, resetLink);

    res.json({ 
      message: 'If an account exists with this email, you will receive a password reset link.',
      // Only include in development
      ...(process.env.NODE_ENV === 'development' && { resetLink })
    });

  } catch (err) {
    console.error('❌ Forgot password error:', err);
    res.status(500).json({ 
      error: 'Failed to process password reset request',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// 🔍 Step 2: Verify reset token
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    console.log('🔍 Verifying reset token');

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      console.log('❌ Invalid or expired token');
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    console.log('✅ Token is valid');
    res.json({ 
      message: 'Token is valid',
      email: user.email // Return email to show on reset form
    });

  } catch (err) {
    console.error('❌ Token verification error:', err);
    res.status(500).json({ error: 'Failed to verify token' });
  }
});

// 🔐 Step 3: Reset password
router.post('/reset/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Validate inputs
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    console.log('🔐 Processing password reset');

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      console.log('❌ Invalid or expired token');
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Update password (pre-save hook will hash it)
    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    console.log('✅ Password reset successful for user:', user.email);

    res.json({ 
      message: 'Password reset successful! You can now login with your new password.' 
    });

  } catch (err) {
    console.error('❌ Password reset error:', err);
    res.status(500).json({ 
      error: 'Failed to reset password',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

export default router;
