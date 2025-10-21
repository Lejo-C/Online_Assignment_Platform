import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  name: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  type: { type: String, enum: ['MCQ', 'TrueFalse'], required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  schedule: { type: Date, required: true },
  duration: { type: Number, required: true }, // in minutes
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

export default mongoose.model('Exam', examSchema);
