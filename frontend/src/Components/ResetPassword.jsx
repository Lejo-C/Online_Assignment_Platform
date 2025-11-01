import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [valid, setValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const res = await fetch(`/api/password/verify/${token}`);
      const data = await res.json();
      setValid(res.ok);
      setMessage(data.message || data.error);
    };
    verifyToken();
  }, [token]);

  const handleReset = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch(`/api/password/reset/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    setMessage(data.message || data.error);

    if (res.ok) {
      // ✅ Redirect after success
      setTimeout(() => navigate('/login'), 2000); // 2-second delay
    }
  } catch (err) {
    setMessage('Server error');
  }
};


  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>
      {valid ? (
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
            Reset Password
          </button>
        </form>
      ) : (
        <p className="text-red-500">{message}</p>
      )}
      {message && valid && <p className="mt-4 text-center text-sm text-green-500">{message}</p>}
    </div>
  );
}
