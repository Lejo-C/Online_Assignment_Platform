import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ExamInstructions() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5000/api/exams/${examId}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        console.log('📥 Received exam:', data);
        setExam(data.exam);
      })
      .catch(err => {
        console.error('❌ Failed to fetch exam:', err);
        setError('Failed to load exam details.');
      });
  }, [examId]);

  const handleStart = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ examId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start exam');

      navigate(`/student/attempt/${examId}/${data.attemptId}`);
    } catch (err) {
      console.error('❌ Failed to start exam:', err);
      alert('Could not start exam. Please try again.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>📘 Exam Instructions</h2>

      {error ? (
        <p className="text-danger">{error}</p>
      ) : !exam ? (
        <p>Loading exam details...</p>
      ) : (
        <div className="card p-4 shadow-sm">
          <h4>{exam.name}</h4>
          <div className="mb-2"><strong>Difficulty:</strong> {exam.difficulty}</div>
          <div className="mb-2"><strong>Type:</strong> {exam.type}</div>
          <div className="mb-2"><strong>Date:</strong> {new Date(exam.date).toLocaleDateString()}</div>
          <div className="mb-2"><strong>Duration:</strong> {exam.duration} minutes</div>

          <hr />
          <p>Please read the instructions carefully before starting the exam:</p>
          <ul>
            <li>Din't refresh the page.</li>
            <li>Do not switch tabs or exit fullscreen during the exam.</li>
            <li>Right-click and keyboard shortcuts are disabled.</li>
            <li>Once started, the timer cannot be paused.</li>
          </ul>

          <div className="text-center mt-4">
            <button className="btn btn-primary" onClick={handleStart}>
              🚀 Start Exam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExamInstructions;
