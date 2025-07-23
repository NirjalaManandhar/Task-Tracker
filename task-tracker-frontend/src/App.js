import './App.css'; 
import Header from './components/Header';
import Button from './components/Button';
import Footer from './components/Footer';
import { useState, useEffect } from "react";
import { fetchTasks } from './api/task';
import TaskList from './components/TaskList';
// onestep api tesko bahira task

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

//why the function is in app.js
//above return we should add all the functions
  useEffect(() => { //useEffect runs when? loads for first time
    const initializeApp = async () => {
      try {
        const data = await fetchTasks();
        setTasks(data);
        setWelcomeMessage("Welcome to your Task Tracker!!!");
        const timer = setTimeout(() => setWelcomeMessage(""), 3000);
        return () => clearTimeout(timer);        
      } catch (err) {
        setError(err.message);      
      } finally {
        setLoading(false);
      }
    };
    initializeApp();
  }, []);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: newTask,
          completed: false,
        },
      ]);
      setNewTask("");
    }
  };

  //code local storage ma save tya bata tanna paryo
  const deleteTask = (id) => {
    if(tasks.find((task) => task.id === id && task.completed))
      // check if task is completed
      setTasks(tasks.filter((task) => task.id !== id));
    else alert("Task not completed yet!! Please complete it before deleting.");    
  };
  

  const toggleComplete = (id) => {
    setTasks(
         tasks.map((task) =>
           task.id === id ? { ...task, completed: !task.completed } : task));
    };

    if (loading) return <div className = "p-4">Loading tasks....</div>;
    if (error) return <div className = "p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto my-8 flex-grow p-4">
        {welcomeMessage && (
          <div className="bg-blue-100 border border-blue-500 text-blue-700 p-4 mb-4">
            <p>{welcomeMessage}</p>
          </div>
        )}

        <h2 className="text-xl mb-4">Dashboard</h2>

        <div className="mb-6 flex">
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
          onDelete={deleteTask}
          onToggleComplete={toggleComplete}
        />

        {/* 📘 About Section */}
        <div className="mt-10 p-6 bg-gray-100 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-2 text-blue-700">About This App</h3>
          <p className="text-gray-700 mb-2">
            The <strong>Task Tracker</strong> is a simple and efficient app built with React to help you manage your daily tasks.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Add new tasks using the input field above.</li>
            <li>Mark tasks as completed using the checkbox.</li>
            <li>Only completed tasks can be deleted (for safety).</li>
            <li>Your tasks are automatically saved in your browser using localStorage.</li>
            <li>The layout is responsive and styled using Tailwind CSS.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;