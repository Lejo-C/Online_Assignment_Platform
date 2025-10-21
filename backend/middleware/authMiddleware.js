import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// 🔐 Middleware to protect routes
export async function protect(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authorized, no token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    console.error('❌ Auth error:', err);
    res.status(401).json({ error: 'Not authorized' });
  }
}

// 🛡️ Middleware to restrict access to admins
export function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied: Admins only' });
  }
}
