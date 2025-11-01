import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import passwordRoutes from './routes/passwordRoutes.js';
import examRoutes from './routes/examRoutes.js';
import http from 'http';
import studentRoutes from './routes/studentRoutes.js';
import resultRoutes from './routes/result.js';
import incidentRoutes from './routes/incidentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import profileRoutes from './routes/profile.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve static frontend files
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
  } else {
    next();
  }
});


app.use(express.json());
app.use(cookieParser());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  

// ✅ API routes
app.use('/api/password', passwordRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api', studentRoutes);
app.use('/api/attempts', resultRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/admin', adminRoutes);

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ✅ SPA fallback (after all routes)
app.use((req, res, next) => {
  // Only fallback for GET requests that aren't API or static
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
  } else {
    next();
  }
});


// ✅ Start server
server.listen(process.env.PORT || 5000, () => {
  
});
