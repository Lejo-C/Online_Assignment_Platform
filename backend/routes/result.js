import express from 'express';
import mongoose from 'mongoose';
import { protect } from '../middleware/authMiddleware.js';
import Attempt from '../models/Attempt.js';

const router = express.Router();

function getExplanationForQuestion(question) {
  return question?.explanation || 'No explanation available.';
}


// ✅ Get result for a specific attempt
router.get('/:id', protect, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid attempt ID format' });
  }

  try {
    const attempt = await Attempt.findById(id).populate({
      path: 'exam',
      populate: {
        path: 'questions',
        select: 'text options correctAnswer explanation',
      },
    });

    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found' });
    }

    if (attempt.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized access to result' });
    }

    // ✅ Enrich feedback with question data
    const enrichedFeedback = attempt.feedback.map((item) => {
      const question = Array.isArray(attempt.exam.questions)
        ? attempt.exam.questions.find((q) =>
            q._id.toString() === item.questionId.toString()
          )
        : null;

      return {
        questionId: item.questionId,
        questionText: question?.text || 'Question text not available',
        studentAnswer: item.studentAnswer || '—',
        correctAnswer: question?.correctAnswer || '',
        isCorrect: item.studentAnswer === question?.correctAnswer,
        explanation: getExplanationForQuestion(question),
      };
    });

    res.json({
      _id: attempt._id,
      exam: attempt.exam._id,
      examTitle: attempt.exam.name,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      percentage: attempt.percentage,
      review: attempt.review,
      submittedAt: attempt.submittedAt,
      feedback: enrichedFeedback,
    });
  } catch (err) {
    console.error('❌ Error fetching attempt result:', err);
    res.status(500).json({ error: 'Failed to fetch result' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { examId } = req.body;
    const studentId = req.user._id;

    const attempt = new Attempt({ student: studentId, exam: examId });
    await attempt.save();

    res.json({ attemptId: attempt._id });
  } catch (err) {
    console.error('❌ Error creating attempt:', err);
    res.status(500).json({ error: 'Failed to create attempt' });
  }
});



export default router;
