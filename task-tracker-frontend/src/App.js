import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import TaskList from './components/TaskList';
import Button from './components/Button';
import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import Stats from './pages/Stats';  

function MainDashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch tasks');
        const data = await res.json();
        setTasks(data);
        setWelcomeMessage('Welcome to your Task Tracker!!!');
        const timer = setTimeout(() => setWelcomeMessage(''), 3000);
        return () => clearTimeout(timer);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [token, navigate]);

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newTask.trim() }),
      });

      if (!res.ok) throw new Error('Failed to add task');
      const savedTask = await res.json();
      setTasks([...tasks, savedTask]);
      setNewTask('');
    } catch (err) {
      alert('Failed to add task: ' + err.message);
    }
  };

  const handleDeleteTask = async (id) => {
    const task = tasks.find((t) => t._id === id);
    if (task && !task.completed) {
      alert('Please complete the task before deleting it.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to delete task');
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleComplete = async (id) => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return;

    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !task.completed }),
      });

      if (!res.ok) throw new Error('Failed to update task');
      const updated = await res.json();
      setTasks(tasks.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      alert(err.message);
    }
  };

  const startEditing = (id, text) => {
    setEditingTaskId(id);
    setEditingText(text);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingText('');
  };

  const saveTask = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: editingText }),
      });

      if (!res.ok) throw new Error('Failed to update task');
      const updated = await res.json();
      setTasks(tasks.map((t) => (t._id === id ? updated : t)));
      cancelEditing();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-4">Loading tasks...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <>
      <h2 className="text-xl mb-4">Dashboard</h2>

      {welcomeMessage && (
        <div className="bg-blue-100 border border-blue-500 text-blue-700 p-4 mb-4">
          {welcomeMessage}
        </div>
      )}

      <div className="mb-6 flex mt-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter new task..."
        />
        <Button type="add" onClick={addTask} />
      </div>

      <TaskList
        tasks={tasks}
        onDelete={handleDeleteTask}
        onToggleComplete={toggleComplete}
        onEdit={startEditing}
        onSave={saveTask}
        onCancel={cancelEditing}
        editingTaskId={editingTaskId}
        editingText={editingText}
        setEditingText={setEditingText}
      />
    </>
  );
}

function App() {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const hideLayout = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen flex flex-col">
      {!hideLayout && <Header />}
      <main className="container mx-auto my-8 flex-grow p-4">
        <Routes>
          {/* Landing only if not logged in */}
          <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Landing />} />

          {/* Dashboard only if logged in */}
          <Route path="/dashboard" element={token ? <MainDashboard /> : <Navigate to="/login" />} />

          {/* Stats page only if logged in */}
          <Route path="/stats" element={token ? <Stats /> : <Navigate to="/login" />} />

          {/* Login and Signup */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />


          {/* Bargraph */}
          <Route path="/stats" element={<Stats />} />

          {/* Catch-all redirect to landing */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;
