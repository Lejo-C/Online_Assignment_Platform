import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import cors from 'cors';
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

const allowedOrigins = [
  'https://online-assignment-platform.netlify.app',
  'http://localhost:5174',
  'http://localhost:5173',
];

// ✅ IMPORTANT: These middlewares MUST come before CORS
app.use(express.json());
app.use(cookieParser());

// ✅ CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    console.log('🔍 Incoming origin:', origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('❌ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const server = http.createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// ✅ API routes (these should come BEFORE static file serving)
app.use('/api/password', passwordRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api', studentRoutes);
app.use('/api/attempts', resultRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/admin', adminRoutes);

// ✅ Serve static frontend files (this should come AFTER API routes)
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// ✅ Catch-all route for SPA - handles client-side routing
app.use((req, res, next) => {
  // If the request is not for an API route, serve index.html
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
  } else {
    next();
  }
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ✅ Start server
server.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});