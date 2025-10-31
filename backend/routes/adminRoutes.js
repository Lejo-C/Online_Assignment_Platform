import express from 'express';
import User from '../models/User.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

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

router.delete('/users/:id', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.deleteOne();
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('❌ Failed to delete user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/users/:id', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // ✅ Delete related incidents
    await Incident.deleteMany({ studentId: user._id });

    // ✅ Delete the user
    await user.deleteOne();

    res.json({ message: 'User and related incidents deleted' });
  } catch (err) {
    console.error('❌ Failed to delete user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


export default router;
