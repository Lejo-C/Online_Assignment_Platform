import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  studentName: { type: String, required: true },
  type: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Incident = mongoose.model('Incident', incidentSchema);
export default Incident;
