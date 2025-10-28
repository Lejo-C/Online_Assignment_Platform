import express from 'express';
import mongoose from 'mongoose';
import Exam from '../models/Exam.js';
import Question from '../models/Question.js';
import Attempt from '../models/Attempt.js';
import User from '../models/User.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import ExamAttempt from '../models/Attempt.js';

const router = express.Router();

// ✅ Get active students currently attempting exams
router.get('/active-students', async (req, res) => {
  try {
    const activeAttempts = await ExamAttempt.find({ submitted: false }).populate('studentId', 'name');
    const students = activeAttempts.map((attempt) => ({
      id: attempt.studentId._id,
      name: attempt.studentId.name,
    }));
    res.json(students);
  } catch (err) {
    console.error('❌ Error fetching active students:', err);
    res.status(500).json({ error: 'Failed to fetch active students' });
  }
});

router.post('/:examId/start', protect, async (req, res) => {
  try {
    const existing = await Attempt.findOne({
      student: req.user._id,
      exam: req.params.examId,
    });

    if (!existing) {
      const attempt = new Attempt({
        student: req.user._id,
        exam: req.params.examId,
        submitted: false,
      });
      await attempt.save();
      console.log(`🚀 Created attempt for student ${req.user._id}`);
    } else {
      console.log(`🔄 Attempt already exists for student ${req.user._id}`);
    }

    res.json({ message: 'Exam attempt initialized' });
  } catch (err) {
    console.error('❌ Error creating exam attempt:', err);
    res.status(500).json({ error: 'Failed to start exam' });
  }
});

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

router.post('/attempts', protect, async (req, res) => {
  try {
    const { examId } = req.body;
    const studentId = req.user._id;

    const existing = await Attempt.findOne({ student: studentId, exam: examId });
    if (existing && existing.submittedAt) {
      return res.status(400).json({ error: 'You have already submitted this exam.' });
    }

    const attempt = new Attempt({ student: studentId, exam: examId });
    await attempt.save();

    res.json({ attemptId: attempt._id });
  } catch (err) {
    console.error('❌ Error creating attempt:', err);
    res.status(500).json({ error: 'Failed to create attempt' });
  }
});

router.get('/:id/questions', async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('questions');
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    res.json({ questions: exam.questions });
  } catch (err) {
    console.error('❌ Error fetching exam questions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', protect, async (req, res) => {
  
  try {
    const exam = await Exam.findById(req.params.id)
      .select('name difficulty type schedule duration questions') // ✅ include all needed fields
      .populate({
    path: 'questions',
    select: 'text options correctAnswer category difficulty type',
  });

    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    console.log('📤 Sending exam:', exam); // debug log
    res.json(exam);
  } catch (err) {
    console.error('❌ Error fetching exam:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/my', protect, async (req, res) => {
  try {
    const attempts = await Attempt.find({ student: req.user._id }).populate({
      path: 'exam',
      select: 'name',
    });

    res.json(attempts);
  } catch (err) {
    console.error('❌ Error fetching attempts:', err);
    res.status(500).json({ error: 'Failed to load attempts' });
  }
});


export default router;
