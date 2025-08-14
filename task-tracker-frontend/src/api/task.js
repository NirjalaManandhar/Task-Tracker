// TaskList.jsx
import React, { useState } from 'react';
import { updateTask, deleteTask } from '../api/tasks'; // adjust import as needed

function TaskList({ tasks, setTasks }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const startEditing = (task) => {
    setEditingId(task._id);
    setEditText(task.text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = async (id) => {
    try {
      const updatedTask = await updateTask(id, { text: editText });
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? updatedTask : task))
      );
      setEditingId(null);
      setEditText('');
    } catch (error) {
      alert('Update failed: ' + error.message);
    }
  };

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task._id} className="flex items-center space-x-2">
          {editingId === task._id ? (
            <>
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="border rounded px-2 py-1"
              />
              <button onClick={() => saveEdit(task._id)} className="text-green-600">
                Save
              </button>
              <button onClick={cancelEditing} className="text-red-600">
                Cancel
              </button>
            </>
          ) : (
            <>
              <span
                className={`flex-grow ${task.completed ? 'line-through text-gray-500' : ''}`}
              >
                {task.text}
              </span>
              <button onClick={() => startEditing(task)} className="text-blue-600">
                Edit
              </button>
              <button
                onClick={() => {
                  if (task.completed) {
                    deleteTask(task._id)
                      .then(() => setTasks((prev) => prev.filter((t) => t._id !== task._id)))
                      .catch((e) => alert('Delete failed: ' + e.message));
                  } else {
                    alert('Complete the task before deleting');
                  }
                }}
                className="text-red-600"
              >
                Delete
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
