import { useState } from 'react';
import 'animate.css';
const apiUrl = import.meta.env.VITE_API_URL;
export default function CreateExam() {
  const [examName, setExamName] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [type, setType] = useState('');
  const [schedule, setSchedule] = useState('');
  const [duration, setDuration] = useState('');
  const [message, setMessage] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();

    const scheduledDate = new Date(schedule);
    const now = new Date();
    if (scheduledDate < now) {
      setMessage('Scheduled time cannot be in the past');
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/exams/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          examName,
          difficulty,
          type,
          schedule,
          duration: Number(duration),
        }),
      });

      const data = await res.json();
      setMessage(data.message || data.error);

      if (res.ok) {
        setExamName('');
        setDifficulty('');
        setType('');
        setSchedule('');
        setDuration('');
      }
    } catch (err) {
      setMessage('Server error');
    }
  };

  return (
    <div className="container mt-5 animate__animated animate__fadeIn">
      <div className="card shadow-lg mx-auto animate__animated animate__zoomIn" style={{ maxWidth: '600px' }}>
        <div className="card-body p-4">
          <h2 className="card-title h4 mb-4 text-center text-primary animate__animated animate__fadeInDown">
            📝 Create Exam
          </h2>
          <form onSubmit={handleCreate}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Exam Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter exam name"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Difficulty Level</label>
              <select
                className="form-select"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                required
              >
                <option value="">Select difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Question Type</label>
              <select
                className="form-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="">Select type</option>
                <option value="MCQ">Multiple Choice</option>
                <option value="TrueFalse">True/False</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Schedule Date & Time</label>
              <input
                type="datetime-local"
                className="form-control"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Duration (in minutes)</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g. 60"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 animate__animated animate__pulse">
              <i className="bi bi-calendar-plus me-2"></i>
              Create Exam
            </button>

            {message && (
              <div className="mt-3 text-center text-danger small animate__animated animate__fadeInUp">
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
