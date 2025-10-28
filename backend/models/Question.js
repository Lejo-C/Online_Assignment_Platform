import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    options: {
      type: [String],
      required: [true, 'Options are required'],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'There must be at least one option',
      },
    },
    // Use "correctAnswer" consistently instead of "answer"
    correctAnswer: {
      type: String,
      required: [true, 'Correct answer is required'],
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    explanation: {
  type: String,
  default: '',
},
    type: {
      type: String,
      enum: ['MCQ', 'TrueFalse'],
      required: [true, 'Question type is required'],
    },
  },
  { timestamps: true }
);

questionSchema.index({ category: 1, difficulty: 1 });

export default mongoose.models.Question || mongoose.model('Question', questionSchema);
