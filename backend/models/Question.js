import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [String],
  answer: { type: String, required: true },
  category: String,
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  type: {
    type: String,
    enum: ['MCQ', 'TrueFalse'],
    required: true,
  },
  correctAnswer: {
  type: String,
  required: true,
}

});

const Question = mongoose.model('Question', questionSchema);
export default Question; // ✅ ES module export
