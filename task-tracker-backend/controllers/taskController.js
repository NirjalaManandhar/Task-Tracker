const Task = require("../models/Task");

exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort("-createdAt");
  res.json(tasks);
};

exports.createTask = async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  const task = await Task.create({ title, user: req.user._id });
  res.status(201).json(task);
};

exports.updateTask = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) return res.status(404).json({ message: "Task not found" });

  task.title = req.body.title || task.title;
  task.completed = req.body.completed ?? task.completed;

  const updated = await task.save();
  res.json(updated);
};

exports.deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!task) return res.status(404).json({ message: "Task not found" });

  res.json({ message: "Task deleted" });
};
