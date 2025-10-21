import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function AttemptExam() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [visited, setVisited] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const currentQuestion = questions[currentIndex];
  // Load questions and draft
  useEffect(() => {
    const fetchQuestionsAndDraft = async () => {
      try {
        const [qRes, dRes] = await Promise.all([
          fetch(`http://localhost:5000/api/exams/${examId}/questions`, { credentials: 'include' }),
          fetch(`http://localhost:5000/api/exams/${examId}/draft`, { credentials: 'include' }),
        ]);

        const questionsData = await qRes.json();
        const draftData = await dRes.json();

        if (qRes.ok && Array.isArray(questionsData)) {
          setQuestions(questionsData);
        }

        if (dRes.ok) {
          setAnswers(draftData.answers || {});
          setMarkedForReview(draftData.markedForReview || {});
        }
      } catch (err) {
        setMessage('Error loading exam data');
      }
    };

    fetchQuestionsAndDraft();
  }, [examId]);

  // Save draft on change
  useEffect(() => {
    const saveDraft = async () => {
      await fetch(`http://localhost:5000/api/exams/${examId}/draft`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, markedForReview }),
      });
    };

    if (questions.length > 0) {
      saveDraft();
    }
  }, [answers, markedForReview]);
// Right-click blocking
  useEffect(() => {
  const disableRightClick = (e) => e.preventDefault();
  reportViolation('Right Click');
  document.addEventListener('contextmenu', disableRightClick);
  return () => document.removeEventListener('contextmenu', disableRightClick);
}, []);
// Shortcut key blocking
  useEffect(() => {
  const blockKeys = (e) => {
    if (
      e.ctrlKey ||
      e.metaKey ||
      ['F12', 'Escape', 'Tab'].includes(e.key) ||
      (e.key === 'r' && e.ctrlKey) || // Ctrl+R
      (e.key === 't' && e.ctrlKey) || // Ctrl+T
      (e.key === 'n' && e.ctrlKey) || // Ctrl+N
      (e.key === 'w' && e.ctrlKey)    // Ctrl+W
    ) {
      e.preventDefault();
      reportViolation(`Shortcut Key: ${e.key}`);
    }
  };
  window.addEventListener('keydown', blockKeys);
  return () => window.removeEventListener('keydown', blockKeys);
}, []);


// Tab switch detection
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      setTabSwitchCount((prev) => {
        const updated = prev + 1;
        if (updated === 1 || updated === 2) {
          alert(`⚠️ Warning: You switched tabs (${updated}/3). Switching again will end the exam.`);
        }
        if (updated >= 3) {
          alert('❌ Exam ended due to tab switching.');
           reportViolation('Tab Switch');
        }
        return updated;
      });
    }
  };
  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
}, []);
// Fullscreen enforcement
useEffect(() => {
  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };
  enterFullscreen();
}, []);

  // Track visited questions
  useEffect(() => {
    if (questions[currentIndex]) {
      setVisited((prev) => ({
        ...prev,
        [questions[currentIndex]._id]: true,
      }));
    }
  }, [currentIndex, questions]);

  const handleAnswer = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };
// Webcam access
  useEffect(() => {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      const videoElement = document.getElementById('webcam');
      if (videoElement) {
        videoElement.srcObject = stream;
        videoElement.play();
      }
    })
    .catch((err) => {
      console.error('❌ Webcam access denied:', err);
    });
}, []);


  const toggleReview = (qid) => {
    setMarkedForReview((prev) => ({
      ...prev,
      [qid]: !prev[qid],
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/exams/${examId}/submit`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, markedForReview }),
      });

      const text = await response.text();
      console.log('📤 Submit raw response:', response.status, text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error('❌ Failed to parse JSON:', err);
        setMessage('Invalid response from server');
        return;
      }

      if (response.ok) {
        setMessage(
          `✅ ${data.message}\nScore: ${data.score}/${data.total} (${data.percent?.toFixed(1) || 0}%)\nReview: ${data.review}`
        );

        setTimeout(() => {
navigate(`/exam/result/${examId}`, { replace: true });
        }, 1000);
      } else {
        setMessage(data.error || 'Submission failed');
      }
    } catch (err) {
      console.error('❌ Submission error:', err);
      setMessage('Submission failed');
    }
  };

  const reportViolation = async (type) => {
  try {
    await fetch('http://localhost:5000/api/incidents/report', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type, // e.g., 'Tab Switch', 'Shortcut Key', 'Right Click'
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (err) {
    console.error('❌ Failed to report violation:', err);
  }
};

  const getButtonColor = (q, i) => {
    const id = q._id;
    if (i === currentIndex) return 'btn-primary';
    if (answers[id]) return 'btn-success';
    if (visited[id]) return 'btn-danger';
    return 'btn-outline-secondary';
  };
console.log('🧪 examId from useParams:', examId);

  return (
    <div className="container-fluid mt-4">
      <video id="webcam" width="200" height="150" muted className="border rounded mb-3" />
      <h2 className="h4 fw-bold mb-3">Attempt Exam</h2>
      {message && <div className="alert alert-info white-space-pre-line">{message}</div>}

      <div className="row">
        {/* Sidebar */}
        <div className="col-3 col-md-2">
          <div className="d-flex flex-wrap gap-2 justify-content-start">
            {questions.map((q, i) => {
              const isMarked = markedForReview[q._id];
              return (
                <button
                  key={q._id}
                  className={`btn btn-sm ${getButtonColor(q, i)} position-relative`}
                  style={{
                    width: '40px',
                    height: '40px',
                    fontSize: '0.8rem',
                    padding: 0,
                    borderRadius: '6px',
                  }}
                  onClick={() => setCurrentIndex(i)}
                  title={`Q${i + 1}${isMarked ? ' (Marked for Review)' : ''}`}
                >
                  {i + 1}
                  {isMarked && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning"
                      style={{ fontSize: '0.6rem' }}
                    >
                      R
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Panel */}
        <div className="col-9 col-md-10">
          {currentQuestion ? (
            <div className="card shadow-sm">
              <div className="card-body">
                <h5><strong>Q{currentIndex + 1}:</strong> {currentQuestion.text}</h5>

                {currentQuestion.type === 'MCQ' ? (
                  currentQuestion.options.map((opt, i) => (
                    <div key={i} className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={currentQuestion._id}
                        value={opt}
                        checked={answers[currentQuestion._id] === opt}
                        onChange={() => handleAnswer(currentQuestion._id, opt)}
                      />
                      <label className="form-check-label">{opt}</label>
                    </div>
                  ))
                ) : (
                  ['true', 'false'].map((opt) => (
                    <div key={opt} className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={currentQuestion._id}
                        value={opt}
                        checked={answers[currentQuestion._id] === opt}
                        onChange={() => handleAnswer(currentQuestion._id, opt)}
                      />
                      <label className="form-check-label">{opt}</label>
                    </div>
                  ))
                )}

                <div className="mt-3 d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => toggleReview(currentQuestion._id)}
                  >
                    {markedForReview[currentQuestion._id] ? 'Unmark Review' : 'Mark for Review'}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => setMessage(`Answer saved for Q${currentIndex + 1}`)}
                  >
                    Save Answer
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-muted">No question selected.</div>
          )}

          <div className="mt-4 d-flex justify-content-between">
            <button
              className="btn btn-outline-dark"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(currentIndex - 1)}
            >
              Previous
            </button>
            <button
              className="btn btn-outline-dark"
              disabled={currentIndex === questions.length - 1}
              onClick={() => setCurrentIndex(currentIndex + 1)}
            >
              Next
            </button>
            <button className="btn btn-success" onClick={handleSubmit}>
              Submit All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
