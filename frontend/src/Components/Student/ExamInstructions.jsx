import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'animate.css';

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

  const enterFullscreen = async () => {
  const elem = document.documentElement; // or any specific element like document.getElementById('exam-container')

  if (elem.requestFullscreen) {
    await elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    await elem.webkitRequestFullscreen(); // Safari
  } else if (elem.msRequestFullscreen) {
    await elem.msRequestFullscreen(); // IE11
  }
};


  const handleStart = async () => {
    try {
      const res = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ examId }),
      });
      await enterFullscreen();
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start exam');

      navigate(`/student/attempt/${examId}/${data.attemptId}`);
    } catch (err) {
      console.error('❌ Failed to start exam:', err);
      alert('Could not start exam. Please try again.');
    }
  };

  return (
    <div className="container mt-4 animate__animated animate__fadeIn">
      <h2 className="text-primary fw-bold mb-4 animate__animated animate__fadeInDown">📘 Exam Instructions</h2>

      {error ? (
        <p className="text-danger text-center">{error}</p>
      ) : !exam ? (
        <p className="text-muted text-center">Loading exam details...</p>
      ) : (
        <div className="card p-4 shadow-lg animate__animated animate__fadeInUp">
          <h4 className="text-success fw-semibold mb-3">{exam.name}</h4>
          <div className="mb-2"><strong>Difficulty:</strong> <span className="badge bg-info text-dark">{exam.difficulty}</span></div>
          <div className="mb-2"><strong>Type:</strong> {exam.type}</div>
          <div className="mb-2"><strong>Date:</strong> {new Date(exam.date).toLocaleDateString()}</div>
          <div className="mb-2"><strong>Duration:</strong> {exam.duration} minutes</div>

          <hr />
          <p className="fw-semibold">Please read the instructions carefully before starting the exam:</p>
          <ul className="list-group list-group-flush mb-3">
            <li className="list-group-item">❗ Don't refresh the page.</li>
            <li className="list-group-item">🚫 Do not switch tabs or exit fullscreen during the exam.</li>
            <li className="list-group-item">🛑 Right-click and keyboard shortcuts are disabled.</li>
            <li className="list-group-item">⏱️ Once started, the timer cannot be paused.</li>
          </ul>

          <div className="text-center mt-4">
            <button className="btn btn-lg btn-primary px-4 py-2 animate__animated animate__pulse" onClick={handleStart}>
              🚀 Start Exam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExamInstructions;
