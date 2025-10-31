import express from 'express';
import User from '../models/User.js';         // ✅ For name and email
import Profile from '../models/Profile.js';   // ✅ For bio and extended info
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';


const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.put('/update', protect, upload.single('avatar'), async (req, res) => {
  try {
    const name = req.body?.name;
    const email = req.body?.email;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();

    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      profile = await Profile.create({ user: req.user._id });
      console.log('🆕 Created missing profile');
    }

    if (req.file) {
      const avatarUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      profile.avatar = avatarUrl;
    }

    await profile.save();

    res.json({ user, profile });
  } catch (err) {
    console.error('❌ Profile update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default router;
