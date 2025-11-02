import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import Incident from '../models/Incident.js';

const router = express.Router(); // ✅ This line is critical

router.get('/users', protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('❌ Failed to fetch users:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

router.get('/users/:id', protect, isAdmin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('❌ Failed to fetch user details:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/users/:id', protect, isAdmin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    console.log('📥 Update payload:', req.body);

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, email, gender, dob } = req.body;

user.name = name || user.name;
user.email = email || user.email;
user.gender = gender?.toLowerCase() || user.gender;
user.dob = dob || user.dob;

    try {
      await user.save();
      res.json({ message: 'User updated successfully' });
    } catch (saveErr) {
      console.error('❌ User save error:', saveErr);
      res.status(400).json({ message: 'Validation failed', details: saveErr.message });
    }
  } catch (err) {
    console.error('❌ Failed to update user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/users/:id', protect, isAdmin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await Incident.deleteMany({ studentId: user._id });
    await user.deleteOne();

    res.json({ message: 'User and related incidents deleted' });
  } catch (err) {
    console.error('❌ Failed to delete user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
