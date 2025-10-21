import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchName = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await res.json();
        console.log('User info:', data);

        if (res.ok && data.name) {
          setName(data.name);
        }
      } catch (err) {
        console.error('Fetch failed:', err);
      }
    };

    fetchName();
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
            View Exam
          </button>

          <button
            onClick={() => navigate('/exam/result/:examId')}
            className="btn btn-outline-success text-start"
          >
            <i className="bi bi-bar-chart-fill me-2"></i>
            View Result
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 p-5">
        <h1 className="display-6 fw-bold mb-3">Welcome, {name || 'Student'}!</h1>
        <p className="text-muted">
          Use the sidebar to access your exams and view your results.
        </p>
      </main>
    </div>
  );
}
