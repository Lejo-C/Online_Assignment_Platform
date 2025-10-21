import express from 'express';
import mongoose from 'mongoose';
import Exam from '../models/Exam.js';
import Question from '../models/Question.js';
import Attempt from '../models/Attempt.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

// ✅ Create a new exam
router.post('/create', protect, async (req, res) => {
  const { examName, difficulty, type, schedule, duration } = req.body;

  if (!examName || !difficulty || !type || !schedule || !duration) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const scheduledDate = new Date(schedule);
  const now = new Date();
  if (isNaN(scheduledDate.getTime())) {
    return res.status(400).json({ error: 'Invalid schedule format' });
  }
  if (scheduledDate < now) {
    return res.status(400).json({ error: 'Scheduled time cannot be in the past' });
  }

  const parsedDuration = Number(duration);
  if (isNaN(parsedDuration) || parsedDuration <= 0) {
    return res.status(400).json({ error: 'Duration must be a positive number' });
  }

  try {
    const questions = await Question.find({ difficulty, type }).limit(10);

    const exam = await Exam.create({
      name: examName,
      difficulty,
      type,
      schedule: scheduledDate,
      duration: parsedDuration,
      questions,
    });

    res.status(201).json({ message: 'Exam created successfully', exam });
  } catch (err) {
    console.error('❌ Exam creation error:', err);
    res.status(500).json({ error: 'Failed to create exam' });
  }
});

// ✅ Enroll a student in an exam
router.post('/enroll/:examId', protect, async (req, res) => {
  const { examId } = req.params;
  const userId = req.user._id;

  try {
    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    if (!exam.enrolledStudents.includes(userId)) {
      exam.enrolledStudents.push(userId);
      await exam.save();
    }

    res.json({ message: 'Enrolled successfully' });
  } catch (err) {
    console.error('Enrollment error:', err);
    res.status(500).json({ error: 'Enrollment failed' });
  }
});

// ✅ Get all assigned exams with student-specific status
router.get('/assigned', protect, async (req, res) => {
  const studentId = req.user._id;

  try {
    const exams = await Exam.find().populate('questions');

    const enrichedExams = await Promise.all(
      exams.map(async (exam) => {
        const enrolled = exam.enrolledStudents.some(
          (id) => id.toString() === studentId.toString()
        );

        const attemptRecord = await Attempt.findOne({
          student: studentId,
          exam: exam._id,
        });

        return {
          _id: exam._id,
          name: exam.name,
          difficulty: exam.difficulty,
          type: exam.type,
          schedule: exam.schedule,
          duration: exam.duration,
          enrolled,
          attempted: !!attemptRecord,
        };
      })
    );

    res.json(enrichedExams);
  } catch (err) {
    console.error('❌ Error fetching assigned exams:', err);
    res.status(500).json({ error: 'Failed to fetch exams' });
  }
});

// ✅ Update an exam
router.put('/update/:id', protect, async (req, res) => {
  try {
    const updated = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Exam updated', exam: updated });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// ✅ Delete an exam
router.delete('/delete/:id', protect, async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    res.json({ message: 'Exam deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// ✅ Get current user info
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('❌ /me route error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get exam by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    res.json(exam);
  } catch (err) {
    console.error('❌ Fetch exam by ID error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get exam questions
router.get('/:id/questions', protect, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('questions');
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    res.json(exam.questions);
  } catch (err) {
    console.error('❌ Fetch exam questions error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id/draft', protect, async (req, res) => {
  try {
    const attempt = await Attempt.findOne({
      student: req.user._id,
      exam: req.params.id,
    });

    if (!attempt) {
      return res.json({ answers: {}, markedForReview: {} });
    }

    res.json({
      answers: attempt.answers || {},
      markedForReview: attempt.markedForReview || {},
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load draft' });
  }
});

// POST draft attempt
router.post('/:id/draft', protect, async (req, res) => {
  try {
    const { answers, markedForReview } = req.body;

    let attempt = await Attempt.findOne({
      student: req.user._id,
      exam: req.params.id,
    });

    if (!attempt) {
      attempt = new Attempt({
        student: req.user._id,
        exam: req.params.id,
        answers,
        markedForReview,
      });
    } else {
      attempt.answers = answers;
      attempt.markedForReview = markedForReview;
    }

    await attempt.save();
    res.json({ message: 'Draft saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save draft' });
  }
});

router.post('/:id/submit', protect, async (req, res) => {
  try {
    const examId = req.params.id;
    const studentId = req.user._id;
    const { answers } = req.body;

    const questions = await Question.find({ exam: examId });
    let score = 0;

    questions.forEach((q) => {
      const given = answers[q._id];
      if (given && given === q.correctAnswer) {
        score += 1;
      }
    });

    const total = questions.length;
    const percent = total > 0 ? (score / total) * 100 : 0;

    let review = '';
    if (percent === 100) review = 'Perfect score! You nailed it 💯';
    else if (percent >= 80) review = 'Great job! You’ve mastered most of the material.';
    else if (percent >= 50) review = 'Good effort! Review the missed questions to improve.';
    else review = 'Needs improvement. Consider revisiting the concepts.';

    const attempt = await Attempt.findOneAndUpdate(
      { student: studentId, exam: examId },
      {
        answers,
        score,
        submittedAt: new Date(),
        review,
      },
      { upsert: true, new: true }
    );

    res.json({
      message: 'Exam submitted successfully',
      score,
      total,
      percent,
      review,
    });
  } catch (err) {
    console.error('❌ Error in submit route:', err);
    res.status(500).json({ error: 'Failed to submit exam' });
  }
});

// ✅ Keep only ONE result route - this should be the final, working version
router.get('/:id/result', protect, async (req, res) => {
  try {
    const examId = req.params.id;  // ✅ Correctly extract the ID from params
    const studentId = req.user._id;

    console.log('📥 GET /result for exam:', examId, 'student:', studentId);

    // ✅ Use the extracted examId variable, not ":examId" string
    const exam = await Exam.findById(examId);
    if (!exam) {
      console.log('❌ Exam not found');
      return res.status(404).json({ error: 'Exam not found' });
    }

    const attempt = await Attempt.findOne({ student: studentId, exam: examId });
    if (!attempt) {
      console.log('❌ Attempt not found');
      return res.status(404).json({ error: 'No attempt found' });
    }

    if (!attempt.submittedAt) {
      console.log('❌ Attempt not submitted yet');
      return res.status(400).json({ error: 'Attempt not submitted yet' });
    }

    const total = await Question.countDocuments({ exam: examId });
    const percent = total > 0 ? (attempt.score / total) * 100 : 0;

    let review = '';
    if (percent === 100) review = 'Perfect score! You nailed it 💯';
    else if (percent >= 80) review = 'Great job! Youve mastered most of the material.';
    else if (percent >= 50) review = 'Good effort! Review the missed questions to improve.';
    else review = 'Needs improvement. Consider revisiting the concepts.';

    console.log('✅ Result ready:', { score: attempt.score, total, percent });

    res.json({
      examName: exam.name,
      score: attempt.score,
      total,
      percent,
      review,
      submittedAt: attempt.submittedAt,
    });
  } catch (err) {
    console.error('❌ Server error in /result:', err);
    res.status(500).json({ error: 'Failed to fetch result' });
  }
});

export default router;
