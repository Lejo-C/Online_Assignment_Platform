import express from 'express';
import Attempt from '../models/Attempt.js';
import Exam from '../models/Exam.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

function getExplanationForQuestion(question) {
  // Later you can pull this from question.explanation or a database
  // For now, return a placeholder
  return 'Review this concept in your notes or textbook.';
}

// 📝 Submit exam, auto-grade, and generate review
router.get('/:id/questions', protect, async (req, res) => {
  try {
    console.log('📥 Fetching questions for exam:', req.params.id);

    const exam = await Exam.findById(req.params.id).populate('questions');
    if (!exam) {
      console.warn('⚠️ Exam not found');
      return res.status(404).json({ error: 'Exam not found' });
    }

    // ✅ Check if the student already submitted this exam
    const attempt = await Attempt.findOne({
  exam: req.params.id,
  student: req.user.id, // or req.user._id depending on your middleware
  submittedAt: { $ne: null },
});

if (attempt) {
  return res.status(403).json({ error: 'Exam already submitted' });
}


    console.log('✅ Exam found:', exam.name);
    res.json({ questions: exam.questions });
  } catch (err) {
    console.error('❌ Error fetching exam questions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/attempts/:id/submit', protect, async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.id)
  .populate({
  path: 'exam',
  populate: {
    path: 'questions',
    select: 'text correctAnswer explanation', // ✅ must include 'explanation'
    options: { strictPopulate: false },
  },
});


    if (!attempt || !attempt.exam)
      return res.status(404).json({ error: "Attempt or exam not found" });

    const { answers = {} } = req.body;
    let score = 0;
    const feedback = [];
for (const q of attempt.exam.questions) {
  const qid = q._id.toString();
  const studentAnswer = answers[qid];
  const correctAnswer = q.correctAnswer;

  const normalizedStudent = typeof studentAnswer === 'string'
    ? studentAnswer.trim().toLowerCase()
    : '';
  const normalizedCorrect = typeof correctAnswer === 'string'
    ? correctAnswer.trim().toLowerCase()
    : '';

  const isCorrect = normalizedStudent === normalizedCorrect;

  // ✅ Add explanation if incorrect
  let explanation = '';
if (isCorrect) {
  score++;
} else {
  explanation = q.explanation || 'Review this concept in your notes or textbook.';
}

  feedback.push({
  questionId: qid,
  questionText: q.question,
  studentAnswer,
  correctAnswer,
  isCorrect,
  explanation, // ✅ must be included here
});



      console.log(`🧩 Question: ${q.text}`);
      console.log(`   Student: "${normalizedStudent}"`);
      console.log(`   Correct: "${normalizedCorrect}"`);
      console.log(`   Match: ${isCorrect}`);
    }

    const total = attempt.exam.questions.length;
    const percentage = (score / total) * 100;

    let review = '🧠 Review the material and try again.';
    if (percentage === 100) review = '🌟 Perfect score!';
    else if (percentage >= 80) review = '🎯 Great job!';
    else if (percentage >= 60) review = '👍 Good effort!';
    else if (percentage >= 40) review = '📘 Keep practicing!';

    attempt.score = score;
attempt.totalQuestions = total;
attempt.percentage = Math.round(percentage);
attempt.review = review;
attempt.feedback = feedback;
attempt.submittedAt = new Date();
console.log('🧠 Final feedback:', feedback);

attempt.feedback = feedback;
await attempt.save();


    return res.json({
      score,
      totalQuestions: total,
      percentage: Math.round(percentage),
      review,
      feedback,
    });
  } catch (err) {
    console.error('❌ Error submitting exam:', err);
    res.status(500).json({ error: 'Failed to submit exam' });
  }
});

router.post('/exams/:examId/start', protect, async (req, res) => {
  try {
    const { examId } = req.params;
    const studentId = req.user.id; // or however user ID is retrieved in 'protect' middleware

    // Check if there is an ongoing attempt that is not submitted yet
    let attempt = await Attempt.findOne({ exam: examId, student: studentId, submittedAt: null });
    
    if (!attempt) {
      // Create a new attempt document
      attempt = new Attempt({
        exam: examId,
        student: studentId,
      });
      await attempt.save();
    }

    const existing = await Attempt.findOne({
  exam: examId,
  student: studentId,
  submittedAt: { $ne: null },
});

if (existing) {
  return res.status(403).json({ error: 'Exam already submitted' });
}

    
    res.json({ attemptId: attempt._id });
  } catch (err) {
    console.error('❌ Error starting exam:', err);
    res.status(500).json({ error: 'Failed to start exam' });
  }
});




export default router;
