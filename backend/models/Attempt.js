import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },


    answers: [
  {
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    selected: { type: String, required: true },
    correct: { type: Boolean },
  },
],


    // ✅ Result metrics
    score: Number,
    totalQuestions: Number,
    percentage: Number,
    review: String,

    // ✅ Feedback for each question
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

    // ✅ Submission and start tracking
    submittedAt: Date,
    startedAt: {
      type: Date,
      default: Date.now, // ✅ Automatically set when attempt is created
    },
  },
  { timestamps: true } // ✅ Adds createdAt and updatedAt
);

export default mongoose.model('Attempt', attemptSchema);
