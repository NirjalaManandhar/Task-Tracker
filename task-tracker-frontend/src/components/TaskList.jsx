import React, { useState } from 'react';

const TaskList = ({
  tasks,
  onDelete,
  onToggleComplete,
  onEdit,
  onSave,
  onCancel,
  editingTaskId,
  editingText,
  setEditingText,
}) => {
  const [taskToDelete, setTaskToDelete] = useState(null);

  const confirmDelete = (taskId) => {
    setTaskToDelete(taskId);
  };

  const handleDelete = () => {
    if (taskToDelete) {
      onDelete(taskToDelete);
      setTaskToDelete(null);
    }
  };

  return (
    <>
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li key={task._id} className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={task.completed || false}
              onChange={() => onToggleComplete(task._id)}
              className="w-5 h-5"
            />
            {editingTaskId === task._id ? (
              <>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="flex-grow p-1 border rounded"
                />
                <button
                  onClick={() => onSave(task._id)}
                  className="bg-green-500 px-3 py-1 rounded text-white"
                >
                  Save
                </button>
                <button
                  onClick={onCancel}
                  className="bg-gray-300 px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span
                  className={`flex-grow ${
                    task.completed ? 'line-through text-gray-500' : ''
                  }`}
                >
                  {task.text}
                </span>
                <button
                  onClick={() => onEdit(task._id, task.text)}
                  className="bg-yellow-400 px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(task._id)}
                  className="bg-red-500 px-3 py-1 rounded text-white"
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Confirmation Modal */}
      {taskToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
            <p className="mb-4 text-gray-800 font-semibold">
              Are you sure you want to delete this task?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setTaskToDelete(null)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskList;
