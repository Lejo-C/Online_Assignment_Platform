import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ExamInstructions() {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/exams/${examId}`,{credentials: 'include',});
        const data = await res.json();
        setExam(data);
      } catch (err) {
        setMessage('Failed to load exam details');
      }
    };
    fetchExam();
  }, [examId]);

  const handleStart = () => {
    navigate(`/exam/attempt/${examId}`, { replace: true });
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
