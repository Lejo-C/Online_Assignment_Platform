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

  if (loading) return <p className="text-gray-500">⏳ Loading result...</p>;
  if (error) return <p className="text-red-600">❌ {error}</p>;
  if (!result || !result.submittedAt) return <p className="text-red-600">❌ No result found for this attempt.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">
          📊 Result for: {result.examTitle || 'Untitled Exam'}
        </h2>
        <div className="text-gray-700 space-y-2 mb-6">
          <p><strong>Score:</strong> {result.score} / {result.totalQuestions}</p>
          <p><strong>Percentage:</strong> {result.percentage}%</p>
          <p><strong>Review:</strong> {result.review || '—'}</p>
        </div>

        <hr className="my-6 border-gray-300" />
        <h4 className="text-xl font-semibold text-gray-800 mb-4">📝 Question Review</h4>

        {Array.isArray(result.feedback) && result.feedback.length > 0 ? (
          result.feedback.map((item, index) => (
            <div
              key={`${item.questionId}-${index}`}
              className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <h5 className="text-lg font-medium text-gray-800 mb-2">
                Q{index + 1}: {item.questionText || 'Question text not available'}
              </h5>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Your Answer:</strong> {item.studentAnswer || '—'}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Correct Answer:</strong> {item.correctAnswer}
              </p>
              <p className={`text-sm font-semibold ${item.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {item.isCorrect ? '✅ Correct' : '❌ Incorrect'}
              </p>
              {!item.isCorrect && item.explanation && (
                <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-3 rounded">
                  <strong>Why?</strong> {item.explanation}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No feedback available for this attempt.</p>
        )}

        <button
          className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 hover:scale-105 transition-all duration-300"
          onClick={() => navigate('/studentDashboard')}
        >
          🔙 Back to Dashboard
        </button>
      </div>
    </div>
  );
}
