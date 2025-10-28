import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ExamInstructions() {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

 useEffect(() => {
  fetch(`http://localhost:5000/api/exams/${examId}`, {
    credentials: 'include',
  })
    .then(async (res) => {
      if (!res.ok) throw new Error('Failed to fetch exam');
      const data = await res.json();
      setExam(data);
      console.log('📥 Received exam:', data);
    })
    .catch((err) => {
      console.error('❌ Error loading exam:', err);
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
    const attemptId = data.attemptId;

    navigate(`/student/attempt/${examId}/${attemptId}`);
  } catch (err) {
    setMessage('Failed to start exam');
  }
};


  if (!exam) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2 className="h4 fw-bold mb-3">Exam Instructions</h2>
      {message && <div className="alert alert-danger">{message}</div>}
      <div className="card p-4">
        <p><strong>Name:</strong> {exam.name}</p>
        <p><strong>Difficulty:</strong> {exam.difficulty}</p>
        <p><strong>Type:</strong> {exam.type}</p>
        <p><strong>Scheduled:</strong> {new Date(exam.schedule).toLocaleString()}</p>
        <p><strong>Duration:</strong> {exam.duration} minutes</p>
        <p><strong>Instructions:</strong> Answer all questions carefully. Do not refresh the page.</p>
        <button className="btn btn-success mt-3" onClick={handleStart}>
          Continue to Exam
        </button>
      </div>
    </div>
  );
}
