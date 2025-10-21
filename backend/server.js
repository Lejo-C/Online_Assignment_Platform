import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js'; // ✅ Make sure this path is correct
import adminRoutes from './routes/admin.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import passwordRoutes from './routes/passwordRoutes.js';
import examRoutes from './routes/examRoutes.js';
import incidentRoutes from './routes/incidentRoutes.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // your frontend origin
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
app.use('/api/admin', adminRoutes);
app.use('/api/exams', examRoutes);
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});
app.use('/api/incidents', incidentRoutes);

app.listen(process.env.PORT || 5000);
