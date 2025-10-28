import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function ResultPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
  fetch(`http://localhost:5000/api/attempts/${attemptId}`, {
    credentials: 'include',
  })
    .then(async (res) => {
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to fetch result');
      }
      const data = await res.json();
      console.log('📦 Received result:', data);
      console.log('🧠 Feedback item 0:', data.feedback?.[0]);
      setResult(data);
    })
    .catch((err) => {
      console.error('❌ Error loading result:', err);
      setError(err.message);
    })
    .finally(() => setLoading(false));
}, [attemptId]);


  if (loading) return <p>⏳ Loading result...</p>;
  if (error) return <p>❌ {error}</p>;
  if (!result || !result.submittedAt) return <p>❌ No result found for this attempt.</p>;

  return (
    <div className="container mt-4">
      <h2>📊 Result for: {result.examTitle || 'Untitled Exam'}</h2>
      <p>
        <strong>Score:</strong> {result.score} / {result.totalQuestions}
      </p>
      <p>
        <strong>Percentage:</strong> {result.percentage}%
      </p>
      <p>
        <strong>Review:</strong> {result.review}
      </p>

      <hr className="my-4" />
      <h4 className="mb-3">📝 Question Review</h4>

      {result.feedback && result.feedback.length > 0 ? (
        result.feedback.map((item, index) => (
          <div key={item.questionId} className="card mb-3 p-3 shadow-sm">
            <h5>Q{index + 1}: {item.questionText}</h5>
            <p>
              <strong>Your Answer:</strong> {item.studentAnswer || '—'}
              <br />
              <strong>Correct Answer:</strong> {item.correctAnswer}
            </p>
            <p className={item.isCorrect ? 'text-success' : 'text-danger'}>
              {item.isCorrect ? '✅ Correct' : '❌ Incorrect'}
            </p>
            {!item.isCorrect && item.explanation && (
              <div className="alert alert-info mt-2">
                <strong>Why?</strong> {item.explanation}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No feedback available for this attempt.</p>
      )}

      <button
        className="btn btn-primary mt-4"
        onClick={() => navigate('/student/dashboard')}
      >
        🔙 Back to Dashboard
      </button>
    </div>
  );
}
