import React, { useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


function AttemptExam() {
  const { examId, attemptId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  console.log('Exam ID:', examId);

  
  useEffect(() => {
    if (!examId) return;

    fetch(`http://localhost:5000/api/exams/${examId}/questions`, {
      credentials: 'include',
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch questions');
        const data = await res.json();
        setQuestions(data.questions);
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ Error loading questions:', err);
        setError('Failed to load exam questions.');
        setLoading(false);
      });
  }, [examId]);

  useEffect(() => {
  const fetchQuestions = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/exams/${examId}/questions`, {
        credentials: 'include',
      });
      const data = await res.json();

      if (!res.ok && data.error === 'Exam already submitted') {
        navigate('/student/dashboard', { replace: true }); // ✅ redirect instead of showing instruction
        return;
      }

      setQuestions(data.questions);
    } catch (err) {
      console.error('❌ Error loading exam:', err);
    }
  };

  fetchQuestions();
}, []);



const handleSubmit = async () => {
  try {
    // ✅ Prepare answers as { [questionId]: selectedAnswer }
    const answers = {};
    questions.forEach((q) => {
      answers[q._id] = selectedAnswers[q._id] || '';
    });

    // ✅ Submit to backend
    const res = await fetch(`http://localhost:5000/api/attempts/${attemptId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ answers }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Submission failed');

    console.log('✅ Submission successful:', data);

    // ✅ Redirect to result page
    navigate(`/student/result/${attemptId}`, { replace: true });
  } catch (err) {
    console.error('❌ Submission failed:', err);
    alert('Something went wrong while submitting. Please try again.');
  }
};


  return (
    <div>
      <h2>📝 Attempt Exam</h2>
      {questions.map((q) => (
        <div key={q._id} style={{ marginBottom: '1rem' }}>
          <p><strong>{q.text}</strong></p>
          {q.options.map((opt, i) => (
            <label key={i} style={{ display: 'block', marginLeft: '1rem' }}>
              <input
                type="radio"
                name={`question-${q._id}`}
                value={opt}
                checked={selectedAnswers[q._id] === opt}
                onChange={() =>
                  setSelectedAnswers((prev) => ({
                    ...prev,
                    [q._id]: opt,
                  }))
                }
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit}>Submit Exam</button>
    </div>
  );
}

export default AttemptExam;
