import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
    },
    answers: [
      {
        question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        selected: String,
        correct: Boolean,
      },
    ],
    score: Number,
    totalQuestions: Number,
    percentage: Number,
    review: String,

    // ✅ Correct feedback structure: array of objects
    feedback: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
        },
        questionText: String,
        studentAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean,
      },
    ],

    submittedAt: Date,
    startedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model('Attempt', attemptSchema);
