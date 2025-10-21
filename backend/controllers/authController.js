import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'User already exists' });

    const user = await User.create({ name, email, password, role });
    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: 'Registration successful', role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: 'Login successful', role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { name, email, role } = req.user;
    res.json({ name, email, role });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};
