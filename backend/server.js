import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js'; // ✅ Make sure this path is correct
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import passwordRoutes from './routes/passwordRoutes.js';
import examRoutes from './routes/examRoutes.js';
import incidentRoutes from './routes/incidentRoutes.js';
import { Server } from 'socket.io';
import http from 'http';
import studentRoutes from './routes/studentRoutes.js';
import resultRoutes from './routes/result.js';
dotenv.config();

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // ✅ unified with Express CORS
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('🟢 Socket connected:', socket.id);

  socket.on('join-room', ({ studentId }) => {
    socket.join(studentId);
    console.log(`👤 Joined room: ${studentId}`);
  });

  socket.on('video-frame', ({ studentId, frame }) => {
    socket.to(studentId).emit('video-frame', frame);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id);
  });
});

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
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});
app.use('/api/incidents', incidentRoutes);
app.use('/api', studentRoutes);
app.use('/api/attempts', resultRoutes);

server.listen(process.env.PORT || 5000, () => {
  console.log(`✅ Server running on http://localhost:${process.env.PORT || 5000}`);
});
