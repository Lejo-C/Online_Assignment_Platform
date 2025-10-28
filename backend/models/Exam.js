import mongoose from 'mongoose';

const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Exam name is required'],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: [true, 'Exam difficulty is required'],
    },
    type: {
      type: String,
      enum: ['MCQ', 'TrueFalse'],
      required: [true, 'Exam type is required'],
    },
    // Establish proper referencing of Question model
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
      },
    ],
    schedule: {
      type: Date,
      required: [true, 'Exam schedule date is required'],
    },
    duration: {
      type: Number,
      required: [true, 'Exam duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

examSchema.index({ schedule: 1 });



export default mongoose.models.Exam || mongoose.model('Exam', examSchema);
