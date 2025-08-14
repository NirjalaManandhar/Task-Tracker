import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-teal-400 to-teal-600 p-6">
      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-teal-300"
        noValidate
      >
        <h2 className="text-3xl font-bold text-center text-teal-700 mb-6">Welcome Back</h2>

        {error && (
          <div className="mb-4 text-sm text-center text-red-600 font-medium">{error}</div>
        )}

        <label htmlFor="email" className="block mb-1 text-gray-700 font-medium">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />

        <label htmlFor="password" className="block mb-1 text-gray-700 font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="w-full p-3 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />

        {/* Forgot password link */}
        <div className="text-right mb-4">
          <span
            onClick={() => navigate('/reset-password')}
            className="text-sm text-teal-600 hover:underline cursor-pointer"
          >
            Forgot password?
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded-md transition-colors ${
            loading ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
          }`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-center mt-6 text-gray-600 text-sm">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            className="text-teal-600 hover:underline cursor-pointer font-medium"
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
