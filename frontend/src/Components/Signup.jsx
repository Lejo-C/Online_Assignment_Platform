import { useState } from 'react';

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://online-assignment-platform.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, gender, dob }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Signup successful!');
        setName('');
        setEmail('');
        setPassword('');
        setGender('');
        setDob('');
      } else {
        setMessage(data.error || 'Signup failed');
      }
    } catch (err) {
      setMessage('Server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-6 sm:px-6">
  <form
    onSubmit={handleSignup}
    className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8 space-y-5"
  >
    <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
      Create an Account
    </h2>

    {/* Full Name */}
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Full Name
      </label>
      <input
        type="text"
        placeholder="John Doe"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mt-1 w-full px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>

    {/* Email */}
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Email
      </label>
      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-1 w-full px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>

    {/* Gender */}
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Gender
      </label>
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="mt-1 w-full px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      >
        <option value="">Select gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
    </div>

    {/* Date of Birth */}
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Date of Birth
      </label>
      <input
        type="date"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        className="mt-1 w-full px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>

    {/* Password */}
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Password
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-sm text-blue-500 hover:underline"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200"
    >
      Sign Up
    </button>

    {/* Message */}
    {message && (
      <p className="text-center text-sm text-red-500 break-words">{message}</p>
    )}

    {/* Login Link */}
    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
      Already have an account?{' '}
      <a href="/login" className="text-blue-500 hover:underline">
        Log in
      </a>
    </p>
  </form>
</div>

  );
}
