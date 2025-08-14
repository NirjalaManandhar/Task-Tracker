import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!email || !newPassword) {
      setMessage('Please fill in both fields.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Reset failed');

      setMessage('Password updated successfully. You can now log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-teal-400 to-teal-600 p-6">
      <form
        onSubmit={handleReset}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-teal-300"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-teal-700">Reset Password</h2>

        {message && <p className="mb-4 text-center text-sm text-red-600 font-medium">{message}</p>}

        <label htmlFor="email" className="block mb-1 font-medium text-gray-700">Email</label>
        <input
          id="email"
          type="email"
          className="w-full p-3 mb-4 border border-gray-300 rounded-md"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="newPassword" className="block mb-1 font-medium text-gray-700">New Password</label>
        <input
          id="newPassword"
          type="password"
          className="w-full p-3 mb-6 border border-gray-300 rounded-md"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-teal-600 text-white font-semibold py-3 rounded-md hover:bg-teal-700 transition"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
