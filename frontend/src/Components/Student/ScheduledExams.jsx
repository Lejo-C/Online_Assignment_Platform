import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ScheduledExams() {
  const [exams, setExams] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const refreshExams = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/exams/assigned', {
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setExams(data);
        setMessage('');
      } else {
        setMessage(data.error || 'Failed to load exams');
      }
    } catch (err) {
      setMessage('Server error while fetching exams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshExams();

    // ✅ Refresh exams when user returns to this page
    const handleFocus = () => {
      refreshExams();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleEnroll = async (examId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/exams/enroll/${examId}`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('');
        const updatedExams = exams.map((exam) =>
          exam._id === examId ? { ...exam, enrolled: true } : exam
        );
        setExams(updatedExams);
      } else if (res.status === 401) {
        setMessage('You must be logged in to enroll');
      } else {
        setMessage(data.error || 'Enrollment failed');
      }
    } catch (err) {
      setMessage('Server error during enrollment');
    }
  };

  const handleAttempt = (examId) => {
    navigate(`/exam/instructions/${examId}`);
  };

  const isAttemptAvailable = (schedule) => {
    const now = new Date();
    const startTime = new Date(schedule);
    return now >= startTime;
  };

  return (
    <div className="container mt-4">
      <h2 className="h4 fw-bold mb-3">Available Exams</h2>

      {message && <div className="alert alert-danger">{message}</div>}
      {loading ? (
        <div className="text-muted">Loading exams...</div>
      ) : exams.length === 0 ? (
        <div className="alert alert-warning">No exams available at the moment.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover bg-white">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Difficulty</th>
                <th>Type</th>
                <th>Schedule</th>
                <th>Duration</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam._id}>
                  <td>{exam.name}</td>
                  <td className="text-capitalize">{exam.difficulty}</td>
                  <td className="text-capitalize">{exam.type}</td>
                  <td>{new Date(exam.schedule).toLocaleString()}</td>
                  <td>{exam.duration} min</td>
                  <td>
                    {!exam.enrolled ? (
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleEnroll(exam._id)}
                      >
                        Enroll
                      </button>
                    ) : exam.attempted ? (
                      <button className="btn btn-success btn-sm" disabled>
                        Attempt Completed
                      </button>
                    ) : isAttemptAvailable(exam.schedule) ? (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleAttempt(exam._id)}
                      >
                        Attempt
                      </button>
                    ) : (
                      <button className="btn btn-secondary btn-sm" disabled>
                        Scheduled
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
