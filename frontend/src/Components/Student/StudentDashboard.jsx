import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const [name, setName] = useState('');
  const [attempts, setAttempts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndAttempts = async () => {
      try {
        // Fetch student name
        const userRes = await fetch('http://localhost:5000/api/auth/me', {
          credentials: 'include',
        });
        const userData = await userRes.json();
        if (userRes.ok && userData.name) {
          setName(userData.name);
        }

        // Fetch student's attempt IDs
        const rawRes = await fetch('http://localhost:5000/api/attempts/my', {
          credentials: 'include',
        });
        const rawData = await rawRes.json();
        console.log('📦 Raw attempts:', rawData);

        if (!rawRes.ok || !Array.isArray(rawData)) {
          throw new Error('Invalid attempt data');
        }

        // Fetch full details for each attempt
        const detailedAttempts = await Promise.all(
          rawData
            .filter((a) => a.exam)
            .map(async (a) => {
              const res = await fetch(`http://localhost:5000/api/attempts/${a._id}`, {
                credentials: 'include',
              });
              const data = await res.json();
              return res.ok ? data : null;
            })
        );

        const valid = detailedAttempts.filter((a) => a !== null);
        setAttempts(valid);
      } catch (err) {
        console.error('❌ Error loading dashboard:', err);
      }
    };

    fetchUserAndAttempts();
  }, []);

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <aside className="bg-white border-end p-4" style={{ width: '260px' }}>
        <h2 className="h5 fw-bold mb-4">Student Panel</h2>
        <div className="d-grid gap-3">
          <button
            onClick={() => navigate('/exam')}
            className="btn btn-outline-primary text-start"
          >
            <i className="bi bi-journal-text me-2"></i>
            View Exams
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 p-5">
        <h1 className="display-6 fw-bold mb-3">Welcome, {name || 'Student'}!</h1>
        <p className="text-muted">Here are your recent exam attempts:</p>

        {attempts.length === 0 ? (
          <p>No valid attempts found.</p>
        ) : (
          <div className="row">
            {attempts.map((attempt) => (
              <div key={attempt._id} className="col-md-6 mb-4">
                <div className="card p-3 shadow-sm">
                  <h5>{attempt.examTitle || 'Untitled Exam'}</h5>
                  <p className="mb-1">
                    {attempt.submittedAt
                      ? `Submitted: ${new Date(attempt.submittedAt).toLocaleString()}`
                      : 'Not yet submitted'}
                  </p>
                  {attempt.submittedAt && (
                    <div className="mb-2">
                      <p className="mb-1"><strong>Score:</strong> {attempt.score ?? '-'} / {attempt.totalQuestions ?? '-'}</p>
                      <p className="mb-1"><strong>Percentage:</strong> {attempt.percentage ?? '-'}%</p>
                      <p className="mb-1"><strong>Review:</strong> {attempt.review || 'No review provided'}</p>
                    </div>
                  )}
                  <div className="d-flex gap-2">
                    {attempt.submittedAt ? (
                      <button
                        className="btn btn-outline-success"
                        onClick={() => navigate(`/student/result/${attempt._id}`)}
                      >
                        View Result
                      </button>
                    ) : (
                      <button
                        className="btn btn-outline-warning"
                        onClick={() =>
                          navigate(`/student/attempt/${attempt.exam}/${attempt._id}`)
                        }
                      >
                        Continue Exam
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
