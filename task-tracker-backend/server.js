require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

// Import models
const User = require('./models/User');
const Task = require('./models/Task');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey123';

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// JWT Middleware to protect routes
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Please log in' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Google OAuth Strategy setup
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL, 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          user = new User({
            name: profile.displayName || '',
            email: profile.emails[0].value,
            password: bcrypt.hashSync('google-auth', 10), // Dummy password for Google users
            googleId: profile.id,
          });
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Health check
app.get('/health', (req, res) => {
  res.send('Backend is up and running!');
});

// Task routes (protected)
app.get('/api/tasks', authenticateJWT, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

app.post('/api/tasks', authenticateJWT, async (req, res) => {
  try {
    const newTask = new Task({
      text: req.body.text,
      user: req.user.id,
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: 'Error creating task' });
  }
});

app.delete('/api/tasks/:id', authenticateJWT, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    await Task.deleteOne({ _id: req.params.id });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

app.patch('/api/tasks/:id', authenticateJWT, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const updates = {};
    if (req.body.completed !== undefined) {
      updates.completed = req.body.completed;
    }
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error updating task' });
  }
});

// Auth routes

// Register route - accepts name, email, password
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }
  const newUser = new User({
    name,
    email,
    password: bcrypt.hashSync(password, 10),
  });
  await newUser.save();
  res.status(201).json({ message: 'User registered successfully' });
});

// Login route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Wrong email or password' });
  }
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: '15m',
  });
  res.json({ token, message: 'Login successful' });
});

// Google OAuth routes
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
  '/api/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id, role: req.user.role }, JWT_SECRET, {
      expiresIn: '15m',
    });
    // Redirect back to frontend with token in URL
    res.redirect(`http://localhost:3000/?token=${token}`);
  }
);

// Logout route (optional)
app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logout successful. Please clear the token on the client side.' });
});

// Start server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
