import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle } from 'lucide-react';

export default function StudentDashboard() {
  const [name, setName] = useState('');
  const [attempts, setAttempts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndAttempts = async () => {
      try {
        const userRes = await fetch('http://localhost:5000/api/auth/me', {
          credentials: 'include',
        });

        if (userRes.status === 401) {
          navigate('/login'); // ✅ redirect if not authenticated
          return;
        }

        const userData = await userRes.json();
        if (userRes.ok && userData.name) {
          setName(userData.name);
        }

        const rawRes = await fetch('http://localhost:5000/api/attempts/my', {
          credentials: 'include',
        });
        const rawData = await rawRes.json();

        if (!rawRes.ok || !Array.isArray(rawData)) {
          throw new Error('Invalid attempt data');
        }

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
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col md:flex-row relative">
  {/* Sidebar */}
  <aside className="bg-white border-b md:border-r shadow-md p-4 md:p-6 w-full md:w-64 flex-shrink-0">
    <h2 className="text-xl font-bold text-indigo-700 mb-4 md:mb-6 text-center md:text-left">Student Panel</h2>
    <div className="flex flex-col gap-4 items-center md:items-start">
      <button
        onClick={() => navigate('/exam')}
        className="w-full md:w-auto px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 hover:scale-105 transition-all duration-300 text-left flex items-center gap-2 justify-center md:justify-start"
      >
        <i className="bi bi-journal-text"></i>
        View Exams
      </button>
    </div>
  </aside>

  {/* Main Content */}
  <main className="flex-grow p-4 md:p-8">
    {/* Profile Icon */}
    <div className="absolute top-4 right-4 md:right-6 z-50">
      <button
        onClick={() => navigate('/profile')}
        className="text-indigo-700 hover:text-indigo-900 hover:scale-105 transition-all duration-300"
      >
        <UserCircle className="w-8 h-8" />
      </button>
    </div>

    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 animate-fade-in text-center md:text-left">
      Welcome, {name || 'Student'}!
    </h1>
    <p className="text-gray-500 mb-6 text-center md:text-left">Here are your recent exam attempts:</p>

    {attempts.length === 0 ? (
      <p className="text-gray-600 text-center">No valid attempts found.</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {attempts.map((attempt) => (
          <div
            key={attempt._id}
            className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-shadow duration-300 border border-gray-100 hover:border-indigo-300"
          >
            <h5 className="text-lg font-semibold text-indigo-600 mb-2 text-center sm:text-left">
              {attempt.exam?.name || 'Untitled Exam'}
            </h5>

            <p className="text-sm text-gray-500 mb-2 text-center sm:text-left">
              {attempt.submittedAt
                ? `Submitted: ${new Date(attempt.submittedAt).toLocaleString()}`
                : 'Not yet submitted'}
            </p>

            {attempt.submittedAt && (
              <div className="text-sm text-gray-700 space-y-1 mb-4 text-center sm:text-left">
                <p><strong>Score:</strong> {attempt.score ?? '-'} / {attempt.totalQuestions ?? '-'}</p>
                <p><strong>Percentage:</strong> {attempt.percentage ?? '-'}%</p>
                <p><strong>Review:</strong> {attempt.review || 'No review provided'}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
              {attempt.submittedAt ? (
                <button
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 hover:scale-105 transition-all duration-300"
                  onClick={() => navigate(`/student/result/${attempt._id}`)}
                >
                  View Result
                </button>
              ) : (
                <button
                  className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 hover:scale-105 transition-all duration-300"
                  onClick={() =>
                    navigate(`/student/attempt/${attempt.exam}/${attempt._id}`)
                  }
                >
                  Continue Exam
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </main>
</div>

  );
}