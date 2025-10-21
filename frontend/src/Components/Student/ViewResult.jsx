import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ViewResult() {
  const [username, setUsername] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          withCredentials: true,
        });
        if (res.data?.username) {
          setUsername(res.data.username);
        } else {
          setErrorMsg('No username found. Please login again.');
        }
      } catch (err) {
        console.error('❌ Error fetching user:', err);
        setErrorMsg('Failed to fetch user info.');
      }
    };
    fetchUser();
  }, []);

  // Fetch results once username is available
  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/results?username=${username}`);
        setResults(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('❌ Error fetching results:', err);
        setErrorMsg('Failed to load results.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [username]);

  // Review generator
  const getReview = (score, total) => {
    const percent = (score / total) * 100;
    if (percent === 100) return '🌟 Perfect score! You nailed it!';
    if (percent >= 80) return '✅ Great job! You’ve mastered this topic.';
    if (percent >= 60) return '👍 Good effort! A bit more practice will help.';
    if (percent >= 40) return '⚠️ You’re getting there. Review the concepts again.';
    return '❌ Needs improvement. Let’s revisit the basics and try again.';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">📊 Your Exam Results</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : errorMsg ? (
        <p className="text-center text-red-500">{errorMsg}</p>
      ) : results.length === 0 ? (
        <p className="text-center text-gray-500">No results found.</p>
      ) : (
        <div className="space-y-6">
          {results.map((r, i) => {
            const percent = ((r.score / r.total) * 100).toFixed(0);
            const badgeColor =
              r.score / r.total >= 0.8 ? 'bg-green-600' :
              r.score / r.total >= 0.6 ? 'bg-yellow-500' :
              'bg-red-500';

            return (
              <div key={i} className="bg-white p-4 rounded shadow-md">
                <h2 className="text-lg font-semibold text-gray-800">📝 Exam ID: {r.examId}</h2>
                <p className="text-sm text-gray-600">📅 Submitted: {new Date(r.submittedAt).toLocaleString()}</p>

                <div className="flex items-center justify-between mt-2">
                  <p className="text-xl font-bold text-green-600">Score: {r.score} / {r.total}</p>
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${badgeColor}`}>
                    {percent}%
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                  <div
                    className="bg-indigo-500 h-4 rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <p className="mt-2 text-gray-700 italic">
                  {r.review ? r.review : getReview(r.score, r.total)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
