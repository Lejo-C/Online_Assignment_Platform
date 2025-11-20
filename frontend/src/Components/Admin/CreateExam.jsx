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

  // Manual questions state (array of questions)
  const [manualQuestions, setManualQuestions] = useState([
    { text: '', options: ['', '', '', ''], correctAnswer: '' },
  ]);

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examName,
          difficulty,
          type,
          schedule: scheduledDate.toISOString(),
          duration: Number(duration),
          manualQuestions: manualQuestions.map((q) => ({
            text: q.text,
            options: type === 'MCQ' ? q.options : [],
            correctAnswer: q.correctAnswer,
            type: type.toLowerCase(), // "mcq" or "truefalse"
            difficulty,
            schedule: scheduledDate.toISOString(),
            duration: Number(duration),
          })),
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
        setManualQuestions([{ text: '', options: ['', '', '', ''], correctAnswer: '' }]);
      }
    } catch (err) {
      setMessage('Server error');
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...manualQuestions];
    updated[index][field] = value;
    setManualQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...manualQuestions];
    updated[qIndex].options[optIndex] = value;
    setManualQuestions(updated);
  };

  const addQuestion = () => {
    setManualQuestions([...manualQuestions, { text: '', options: ['', '', '', ''], correctAnswer: '' }]);
  };

  const deleteQuestion = (index) => {
    const updated = manualQuestions.filter((_, i) => i !== index);
    setManualQuestions(updated.length ? updated : [{ text: '', options: ['', '', '', ''], correctAnswer: '' }]);
  };

  return (
    <div className="container mt-5 animate__animated animate__fadeIn">
      <div className="card shadow-lg mx-auto animate__animated animate__zoomIn" style={{ maxWidth: '600px' }}>
        <div className="card-body p-4">
          <h2 className="card-title h4 mb-4 text-center text-primary animate__animated animate__fadeInDown">
            📝 Create Exam
          </h2>
          <form onSubmit={handleCreate}>
            {/* Exam fields */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Exam Name</label>
              <input type="text" className="form-control" value={examName} onChange={(e) => setExamName(e.target.value)} required />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Difficulty Level</label>
              <select className="form-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} required>
                <option value="">Select difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Question Type</label>
              <select className="form-select" value={type} onChange={(e) => setType(e.target.value)} required>
                <option value="">Select type</option>
                <option value="MCQ">Multiple Choice</option>
                <option value="TrueFalse">True/False</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Schedule Date & Time</label>
              <input type="datetime-local" className="form-control" value={schedule} onChange={(e) => setSchedule(e.target.value)} required />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Duration (minutes)</label>
              <input type="number" className="form-control" value={duration} onChange={(e) => setDuration(e.target.value)} required />
            </div>

            {/* Manual Questions */}
            <h5 className="mt-4">➕ Add Manual Questions</h5>
            {manualQuestions.map((q, qIndex) => (
              <div key={qIndex} className="border rounded p-3 mb-3">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Question Text</label>
                  <input
                    type="text"
                    className="form-control"
                    value={q.text}
                    onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                  />
                </div>

                {type === 'MCQ' && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Options</label>
                    {q.options.map((opt, idx) => (
                      <input
                        key={idx}
                        type="text"
                        className="form-control mb-2"
                        placeholder={`Option ${idx + 1}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(qIndex, idx, e.target.value)}
                      />
                    ))}
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label fw-semibold">Correct Answer</label>
                  {type === 'TrueFalse' ? (
                    <select
                      className="form-select"
                      value={q.correctAnswer}
                      onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                    >
                      <option value="">Select answer</option>
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  ) : (
                    <select
                      className="form-select"
                      value={q.correctAnswer}
                      onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                    >
                      <option value="">Select correct option</option>
                      {q.options.map((opt, idx) => (
                        <option key={idx} value={opt}>
                          {opt || `Option ${idx + 1}`}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <button type="button" className="btn btn-danger" onClick={() => deleteQuestion(qIndex)}>
                  🗑️ Delete Question
                </button>
              </div>
            ))}

            <button type="button" className="btn btn-secondary mb-3" onClick={addQuestion}>
              ➕ Add Another Question
            </button>

            <button type="submit" className="btn btn-primary w-100 animate__animated animate__pulse">
              Create Exam
            </button>

            {message && <div className="mt-3 text-center text-danger small">{message}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
