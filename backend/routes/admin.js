import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// GET all users or filter by role
router.get('/users', async (req, res) => {
  try {
    const role = req.query.role;
    const query = role ? { role } : {};
    const users = await User.find(query).select('-password'); // exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// PUT update user role
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    await User.findByIdAndUpdate(req.params.id, { role });
    res.json({ message: 'Role updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// DELETE user
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
