import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js'; // ✅ Make sure this path is correct
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import passwordRoutes from './routes/passwordRoutes.js';
import examRoutes from './routes/examRoutes.js';
import http from 'http';
import studentRoutes from './routes/studentRoutes.js';
import resultRoutes from './routes/result.js';
import incidentRoutes from './routes/incidentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';


dotenv.config();
const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: 'http://localhost:5173', // ✅ your frontend origin
  credentials: true,
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err.message));

// ✅ Mount the route
app.use('/api/password', passwordRoutes);

app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);

import profileRoutes from './routes/profile.js';
app.use('/api/profile', profileRoutes);

app.use('/api', studentRoutes);
app.use('/api/attempts', resultRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

server.listen(process.env.PORT || 5000, () => {
  console.log(`✅ Server running on http://localhost:${process.env.PORT || 5000}`);
});
