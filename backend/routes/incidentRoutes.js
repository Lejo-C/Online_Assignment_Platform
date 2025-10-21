import express from 'express';
import Incident from '../models/Incident.js'; // ✅ Missing import added
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all incidents (admin only)
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ timestamp: -1 });
    res.json(incidents);
  } catch (err) {
    console.error('❌ Error fetching incidents:', err);
    res.status(500).json({ message: 'Server error fetching incidents' });
  }
});

// POST a new incident (student violation)
router.post('/report', protect, async (req, res) => {
  const { type, timestamp } = req.body;
  const studentId = req.user._id;
  const studentName = req.user.name;

  try {
    const incident = new Incident({
      studentId,
      studentName,
      type,
      timestamp,
    });

    await incident.save();
    res.status(201).json({ message: 'Violation logged' });
  } catch (err) {
    console.error('❌ Error logging incident:', err);
    res.status(500).json({ message: 'Failed to log incident' });
  }
});

export default router;
