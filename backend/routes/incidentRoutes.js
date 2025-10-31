import express from 'express';
import Incident from '../models/Incident.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import mongoose from 'mongoose';

const router = express.Router();

// ✅ Log incident
router.post('/report', protect, async (req, res) => {
  const { type, timestamp, examId } = req.body;
  console.log('📥 Received incident:', { type, timestamp, examId });

  const studentId = req.user._id;
  const studentName = req.user.name;

  if (!type || !timestamp || !examId) {
    return res.status(400).json({ error: 'Missing type, timestamp, or examId' });
  }

  try {
    const incident = new Incident({
      studentId,
      studentName,
      exam: new mongoose.Types.ObjectId(examId), // ✅ force-cast here
      type,
      timestamp,
    });

    await incident.save();
    console.log('✅ Incident saved:', incident);
    res.status(201).json({ message: 'Violation logged' });
  } catch (err) {
    console.error('❌ Error logging incident:', err.message);
    res.status(500).json({ message: 'Failed to log incident' });
  }
});

// ✅ Fetch incidents for admin
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    const incidents = await Incident.find()
      .populate('exam', 'name') // ✅ updated from 'title' to 'name'
      .populate('studentId', 'name role')
      .sort({ timestamp: -1 });
    res.json(incidents); // <-- No filter
  } catch (err) {
    console.error('❌ Error fetching incidents:', err);
    res.status(500).json({ message: 'Failed to fetch incidents' });
  }
});

export default router;
