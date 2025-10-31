import express from 'express';
import Attempt from '../models/Attempt.js';
import Exam from '../models/Exam.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


// 📝 Submit exam, auto-grade, and generate review
router.post('/attempts/:id/submit', protect, async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.id)
      .populate({
        path: 'exam',
        populate: {
          path: 'questions',
          select: 'question correctAnswer explanation', // ✅ must include 'explanation'
          options: { strictPopulate: false },
        },
      });


    if (!attempt || !attempt.exam)
      return res.status(404).json({ error: "Attempt or exam not found" });

    const answersMap = {};
    for (const a of attempt.answers) {
      answersMap[a.question.toString()] = a.selected;
    }

    let score = 0;
    const feedback = [];
    const answerRecords = [];

    for (const q of attempt.exam.questions) {
      const qid = q._id.toString();
      const studentAnswer = answersMap[qid];
      const correctAnswer = q.correctAnswer;

      const normalizedStudent = typeof studentAnswer === 'string'
        ? studentAnswer.trim().toLowerCase()
        : '';
      const normalizedCorrect = typeof correctAnswer === 'string'
        ? correctAnswer.trim().toLowerCase()
        : '';

      const isCorrect = normalizedStudent === normalizedCorrect;

      console.log(`🧠 q.question for ${qid}:`, q.question);
      console.log(`🧠 q.explanation for ${qid}:`, q.explanation);

      // ✅ Add explanation if incorrect
      let explanation = '';
      if (!isCorrect) {
        explanation = q.explanation?.trim() || 'Review this concept in your notes or textbook.';
      } else {
        score += 1;
      }

      answerRecords.push({
        question: q._id,
        selected: studentAnswer,
        correct: isCorrect,
      });

      feedback.push({
        questionId: qid,
        questionText: q.question,
        studentAnswer,
        correctAnswer,
        isCorrect,
        explanation, // ✅ must be here
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
    console.log('🧠 Final feedback before save:', feedback);
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

router.post('/attempts/:attemptId/answer', protect, async (req, res) => {
  const { attemptId } = req.params;
  const { questionId, selected } = req.body;

  try {
    const attempt = await Attempt.findById(attemptId);
    if (!attempt) return res.status(404).json({ error: 'Attempt not found' });

    const existing = attempt.answers.find(
      (a) => a.question.toString() === questionId
    );

    if (existing) {
      existing.selected = selected;
    } else {
      attempt.answers.push({
        question: questionId,
        selected,
        correct: null,
      });
    }

    attempt.markModified('answers');
    await attempt.save();

    res.json({ success: true });
  } catch (err) {
    console.error('❌ Failed to save answer:', err);
    res.status(500).json({ error: 'Failed to save answer' });
  }
});

router.get('/attempts/my', protect, async (req, res) => {
  try {
    const attempts = await Attempt.find({ student: req.user._id }).populate('exam');
    res.json(attempts);
  } catch (err) {
    console.error('❌ Failed to fetch attempt:', err);
    res.status(500).json({ error: 'Failed to fetch attempt' });
  }
});

router.get('/attempts/:id', protect, async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.id).populate('answers.question');
    if (!attempt) return res.status(404).json({ error: 'Attempt not found' });

    res.json(attempt);
  } catch (err) {
    console.error('❌ Failed to fetch attempt:', err);
    res.status(500).json({ error: 'Failed to fetch attempt' });
  }
});

export default router;
