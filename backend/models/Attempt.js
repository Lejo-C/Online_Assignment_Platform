import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  submittedAt: { type: Date },
  score: { type: Number },
  answers: {
    type: Map,
    of: String,
    default: {},
  },
  markedForReview: {
    type: Map,
    of: Boolean,
    default: {},
  },
});


export default mongoose.model('Attempt', attemptSchema);
