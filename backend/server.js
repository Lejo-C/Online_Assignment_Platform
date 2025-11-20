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
import profileRoutes from './routes/profile.js';
// import manualQuestionRoutes from "./routes/manualQuestionRoutes.js";

dotenv.config();
const app = express();

const allowedOrigins = [
  'https://online-assignment-platform.netlify.app',
  'http://localhost:5174',
  'http://localhost:5173',
];

app.use(express.json());
app.use(cookieParser());

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

// ✅ MongoDB connection - remove deprecated options
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// ✅ API routes
app.use('/api/password', passwordRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api', studentRoutes);
app.use('/api/attempts', resultRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/admin', adminRoutes);
// app.use("/api/manual-questions", manualQuestionRoutes);
// ✅ Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
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