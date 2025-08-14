import { useEffect, useState } from 'react';

function BarChart({ tasks }) {
  const completed = tasks.filter(t => t.completed).length;
  const incomplete = tasks.length - completed;
  const maxHeight = 300; // taller bars
  const maxCount = Math.max(completed, incomplete, 1);
  const completedHeight = (completed / maxCount) * maxHeight;
  const incompleteHeight = (incomplete / maxCount) * maxHeight;

  return (
    <svg width="500" height="370" aria-label="Task completion bar chart">
      {/* Bars */}
      <rect x="100" y={maxHeight - completedHeight + 60} width="150" height={completedHeight} fill="#3b82f6" />
      <rect x="300" y={maxHeight - incompleteHeight + 60} width="150" height={incompleteHeight} fill="#ef4444" />

      {/* Labels */}
      <text x="175" y="350" textAnchor="middle" fill="#000" fontSize="22">Completed</text>
      <text x="375" y="350" textAnchor="middle" fill="#000" fontSize="22">Incomplete</text>

      {/* Counts */}
      <text x="175" y={maxHeight - completedHeight + 55} textAnchor="middle" fill="#000" fontSize="20" fontWeight="bold">{completed}</text>
      <text x="375" y={maxHeight - incompleteHeight + 55} textAnchor="middle" fill="#000" fontSize="20" fontWeight="bold">{incomplete}</text>
    </svg>
  );
}

function PieChart({ tasks }) {
  const completed = tasks.filter(t => t.completed).length;
  const incomplete = tasks.length - completed;
  const total = tasks.length || 1;

  const completedAngle = (completed / total) * 2 * Math.PI;
  const incompleteAngle = (incomplete / total) * 2 * Math.PI;

  const radius = 140; // bigger radius
  const centerX = 170;
  const centerY = 170;

  const describeArc = (startAngle, endAngle) => {
    const startX = centerX + radius * Math.cos(startAngle);
    const startY = centerY + radius * Math.sin(startAngle);
    const endX = centerX + radius * Math.cos(endAngle);
    const endY = centerY + radius * Math.sin(endAngle);
    const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;

    return `M${centerX},${centerY} L${startX},${startY} A${radius},${radius} 0 ${largeArcFlag} 1 ${endX},${endY} Z`;
  };

  return (
    <svg width="350" height="350" aria-label="Task completion pie chart">
      {/* Completed slice */}
      <path d={describeArc(0, completedAngle)} fill="#3b82f6" />
      {/* Incomplete slice */}
      <path d={describeArc(completedAngle, completedAngle + incompleteAngle)} fill="#ef4444" />

      {/* Labels */}
      <text x={centerX} y={centerY - 15} textAnchor="middle" fill="#000" fontSize="20" fontWeight="bold">
        Tasks
      </text>
      <text x={centerX} y={centerY + 30} textAnchor="middle" fill="#000" fontSize="18">
        {completed} completed
      </text>
      <text x={centerX} y={centerY + 60} textAnchor="middle" fill="#000" fontSize="18">
        {incomplete} incomplete
      </text>
    </svg>
  );
}

const Stats = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

    const fetchTasks = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch tasks');
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [token]);

  if (loading) return <div className="p-4">Loading stats...</div>;

  return (
    <div className="min-h-screen bg-blue-50 py-8">
        <h2 className="text-3xl font-semibold mb-10 text-blue-600 text-center">Task Completion Stats</h2>
        <div className="flex flex-wrap justify-center gap-16 items-start">
          <div className="flex flex-col items-center">
            <h3 className="mb-4 text-lg font-semibold text-gray-700">Bar Graph</h3>
            <BarChart tasks={tasks} />
          </div>
          <div className="flex flex-col items-center">
            <h3 className="mb-4 text-lg font-semibold text-gray-700">Pie Chart</h3>
            <PieChart tasks={tasks} />
          </div>
        </div>
    </div>
  );
};

export default Stats;
