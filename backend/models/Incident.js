import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  studentName: { type: String, required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
  type: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Incident', incidentSchema);
