import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function AttemptExam() {
  const { examId, attemptId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visited, setVisited] = useState(new Set());
  const [duration, setDuration] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);

  const logIncident = async (type) => {
    try {
      await fetch('http://localhost:5000/api/incidents/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          type,
          timestamp: new Date().toISOString(),
          examId,
        }),
      });
    } catch (err) {
      console.error('❌ Failed to log incident:', err);
    }
  };

  const handleStartExam = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setStarted(true);
    } catch (err) {
      console.warn('❌ Fullscreen request failed:', err);
    }
  };

  useEffect(() => {
    fetch(`http://localhost:5000/api/exams/${examId}?attemptId=${attemptId}`, {
      credentials: 'include',
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch exam');
        const data = await res.json();

        const durationMinutes = data.exam.duration || 30;
        setQuestions(data.exam.questions);
        setDuration(durationMinutes);

        if (!data.startedAt) {
          setError('Exam start time missing.');
          return;
        }

        const startedAt = new Date(data.startedAt).getTime();
        const now = Date.now();
        const elapsed = Math.floor((now - startedAt) / 1000);
        const remaining = durationMinutes * 60 - elapsed;

        if (remaining <= 0) {
          alert('⏰ Time is already up. Redirecting to result.');
          navigate(`/student/result/${attemptId}`, { replace: true });
          return;
        }

        setTimeLeft(remaining);
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ Error loading exam:', err);
        setError('Failed to load exam.');
        setLoading(false);
      });
  }, [examId, attemptId]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          alert('⏰ Time is up! Submitting your exam.');
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    setVisited((prev) => new Set(prev).add(currentIndex));
  }, [currentIndex]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        alert('⚠️ Tab switch detected. This has been flagged.');
        logIncident('tab-switch');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        alert('⚠️ You exited fullscreen. This has been flagged.');
        logIncident('fullscreen-exit');
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      alert('⚠️ Right-click is disabled. This has been flagged.');
      logIncident('right-click');
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/attempts/${attemptId}`, {
          credentials: 'include',
        });
        const data = await res.json();

        const initialAnswers = {};
for (const a of data.answers || []) {
  initialAnswers[a.question.toString()] = a.selected;
}
setSelectedAnswers(initialAnswers);
console.log('🧠 Preloaded answers:', initialAnswers);
      } catch (err) {
        console.error('❌ Failed to load attempt:', err);
      }
    };

    fetchAttempt();
  }, [attemptId]);

  const handleAnswerChange = async (qid, answer) => {
    setSelectedAnswers((prev) => ({ ...prev, [qid]: answer }));

    try {
      const res = await fetch(`http://localhost:5000/api/attempts/${attemptId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ questionId: qid, selected: answer }),
      });

      const data = await res.json();
      console.log('✅ Answer saved:', data);
    } catch (err) {
      console.error('❌ Failed to save answer:', err);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/attempts/${attemptId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      navigate(`/student/result/${attemptId}`, { replace: true });
    } catch (err) {
      console.error('❌ Submission failed:', err);
      alert('Something went wrong while submitting. Please try again.');
    }
  };

  const currentQuestion = questions[currentIndex];
  const formatTime = (secs) => {
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };


  return (
  <div className="container mt-4">
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
      <h2 className="fw-bold text-primary mb-3 mb-md-0 animate__animated animate__fadeInDown">
        📝 Attempt Exam
      </h2>
      <div className="badge bg-warning text-dark fs-5 px-3 py-2 rounded-pill animate__animated animate__pulse animate__infinite">
        ⏳ Time Left: {formatTime(timeLeft)}
      </div>
    </div>

    {loading ? (
      <p className="text-center text-muted">Loading questions...</p>
    ) : error ? (
      <p className="text-danger text-center">{error}</p>
    ) : (
      <div className="row">
        {/* Question Navigator */}
        <div className="col-12 col-md-2 mb-4 mb-md-0">
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            {questions.map((q, i) => {
              const isVisited = visited.has(i);
              const isAnswered = selectedAnswers[q._id];

              let btnClass = 'btn-outline-dark';
              if (isAnswered) btnClass = 'btn-success';
              else if (isVisited) btnClass = 'btn-danger';

              return (
                <button
                  key={q._id}
                  className={`btn btn-sm ${btnClass} ${i === currentIndex ? 'border border-3 border-dark' : ''} animate__animated animate__fadeIn`}
                  onClick={() => setCurrentIndex(i)}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Display */}
        <div className="col-12 col-md-10">
          <div className="card p-4 mb-3 shadow-sm animate__animated animate__fadeInUp">
            <h5 className="mb-3 text-secondary">
              Question {currentIndex + 1} of {questions.length}
            </h5>
            {currentQuestion ? (
              <>
                <p className="fw-semibold">{currentQuestion.text}</p>
                {currentQuestion.options.map((opt, i) => (
                  <label key={i} className="d-block mb-2 ps-3">
                    <input
                      type="radio"
                      name={`question-${currentQuestion._id}`}
                      checked={selectedAnswers[currentQuestion._id.toString()] === opt}
                      onChange={() => handleAnswerChange(currentQuestion._id, opt)}
                      className="form-check-input me-2"
                    />
                    {opt}
                  </label>
                ))}
              </>
            ) : (
              <p className="text-danger">❌ Question not found.</p>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="d-flex justify-content-between mb-4">
            <button
              className="btn btn-outline-secondary px-4"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => prev - 1)}
            >
              ⬅️ Previous
            </button>

            <button
              className="btn btn-outline-secondary px-4"
              disabled={currentIndex === questions.length - 1}
              onClick={() => setCurrentIndex((prev) => prev + 1)}
            >
              Next ➡️
            </button>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              className="btn btn-success px-5 py-2 animate__animated animate__pulse"
              onClick={handleSubmit}
            >
              ✅ Submit Exam
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}

export default AttemptExam;
