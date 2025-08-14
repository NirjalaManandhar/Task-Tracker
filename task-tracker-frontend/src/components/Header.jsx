import { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const isLoggedIn = !!localStorage.getItem('token');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <>
      <header className="bg-cyan-400 text-white p-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Task Tracker</Link>
        <nav className="space-x-4">
          {!isLoggedIn && (
            <Link to="/" className="hover:underline">Home</Link>
          )}

          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <Link to="/stats" className="hover:underline">Progress</Link>
              <button
                onClick={() => setShowConfirm(true)}
                className="hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/signup" className="hover:underline">Sign Up</Link>
            </>
          )}
        </nav>
      </header>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
            <p className="mb-4 text-gray-800 font-semibold">Are you sure you want to logout?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setShowConfirm(false);
                }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded bg-red-400 text-white hover:bg-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
