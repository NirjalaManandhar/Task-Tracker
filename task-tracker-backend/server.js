const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

const app = express();
const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Dummy task data
let tasks = [
  { id: 1, text: "Learn React", complete: false },
  { id: 2, text: "Build Express API", complete: false },
  { id: 3, text: "Connect Frontend to Backend", complete: false },
];

// Dummy users (In real app, use a database)
let users = [
  {
    id: 1,
    email: "user@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: "user",
  },
];

// Configure Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      let user = users.find((u) => u.email === profile.emails[0].value);
      if (!user) {
        user = {
          id: String(users.length + 1),
          email: profile.emails[0].value,
          password: bcrypt.hashSync("google-auth", 10),
          role: "user",
        };
        users.push(user);
      }
      return done(null, user);
    }
  )
);

// Health check route
app.get("/health", (req, res) => {
  res.send("Backend is up and running!");
});

// Get all tasks
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// JWT login route
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Wrong email or password" });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "15m",
  });

  res.json({ token, message: "Login successful" });
});

// Google OAuth start
app.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id, role: req.user.role }, JWT_SECRET, {
      expiresIn: "15m",
    });
    res.json({ token, message: "Google login successful" });
  }
);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
