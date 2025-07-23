const API_URL = 'http://localhost:5000/api/tasks';

export const fetchTasks = async () => {
  const token = localStorage.getItem("token"); // get token from localStorage
  if (!token) throw new Error("No token found, please login");

  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,  // send token in header
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch tasks: ' + response.statusText);
  }
  return await response.json();
};
