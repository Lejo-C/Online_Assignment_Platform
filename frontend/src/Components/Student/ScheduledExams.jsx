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
      const res = await fetch('${apiUrl}/api/exams/assigned', {
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
    const handleFocus = () => refreshExams();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleEnroll = async (examId) => {
    try {
      const res = await fetch(`${apiUrl}/api/exams/enroll/${examId}`, {
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📅 Available Exams</h2>

      {message && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{message}</div>}
      {loading ? (
        <p className="text-gray-500">Loading exams...</p>
      ) : exams.length === 0 ? (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded">No exams available at the moment.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full bg-white border border-gray-200 text-sm text-left">
            <thead className="bg-indigo-100 text-indigo-700">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Difficulty</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Schedule</th>
                <th className="px-4 py-2">Duration</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 font-medium text-gray-800">{exam.name}</td>
                  <td className="px-4 py-2 capitalize">{exam.difficulty}</td>
                  <td className="px-4 py-2 capitalize">{exam.type}</td>
                  <td className="px-4 py-2">{new Date(exam.schedule).toLocaleString()}</td>
                  <td className="px-4 py-2">{exam.duration} min</td>
                  <td className="px-4 py-2">
                    {!exam.enrolled ? (
                      <button
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 hover:scale-105 transition-all duration-300"
                        onClick={() => handleEnroll(exam._id)}
                      >
                        Enroll
                      </button>
                    ) : exam.attempted ? (
                      <button
                        className="px-3 py-1 bg-green-100 text-green-700 rounded cursor-not-allowed"
                        disabled
                      >
                        Attempt Completed
                      </button>
                    ) : isAttemptAvailable(exam.schedule) ? (
                      <button
                        className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 hover:scale-105 transition-all duration-300"
                        onClick={() => handleAttempt(exam._id)}
                      >
                        Attempt
                      </button>
                    ) : (
                      <button
                        className="px-3 py-1 bg-gray-200 text-gray-600 rounded cursor-not-allowed"
                        disabled
                      >
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
