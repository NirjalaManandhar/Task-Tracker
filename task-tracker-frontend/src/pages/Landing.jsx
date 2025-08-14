import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      navigate('/dashboard'); // Redirect logged-in users
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-cyan-100 to-cyan-200 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-2xl w-full text-center border border-cyan-200">
        <h1 className="text-5xl font-extrabold text-cyan-600 mb-4">Task Tracker</h1>
        <p className="text-lg text-gray-600 mb-6">
          Stay on top of your to-dos and take control of your day. Simple, fast, and tailored for you.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate('/signup')}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 px-6 rounded-lg transition"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate('/login')}
            className="border border-cyan-500 text-cyan-600 hover:bg-cyan-100 font-medium py-3 px-6 rounded-lg transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
