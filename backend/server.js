// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const path = require('path');

const app = express();
app.use(express.json());

// ——————————————
// 1) MONGO CONNECTION
// ——————————————
console.log('MONGO_URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ DB connection error:', err));

// ——————————————
// 2) SESSION + PASSPORT SETUP
// ——————————————
// (a) Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// (b) Passport init
app.use(passport.initialize());
app.use(passport.session());

// (c) Load your Passport strategy config
require('./config/passport');

// ——————————————
// 3) ROUTES
// ——————————————
// (a) Google OAuth endpoints
app.use('/auth', require('./routes/auths'));

// (b) Your existing user API
app.use('/api/users', require('./routes/userRoutes'));

// (c) Test or protected route
app.get('/', (req, res) => {
  res.send(req.user
    ? `Hello ${req.user.name}!`
    : 'Hello from TaskWhiz backend!'
  );
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/dashboard'); // Redirect to a protected route
  }
);

// ——————————————
// 4) SERVE FRONTEND
// ——————————————
console.log('Serving static files from:', path.join(__dirname, 'frontend'));
app.use(express.static(path.join(__dirname, 'frontend')));

// ——————————————
// 5) TASK API
// ——————————————
const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Task = mongoose.model('Task', taskSchema);

app.post('/api/tasks', async (req, res) => {
  const { task } = req.body;
  if (!task || task.trim() === '') {
    return res.status(400).json({ error: 'Task description is required' });
  }

  try {
    const newTask = new Task({ task });
    await newTask.save();

    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task. Please try again later', details: error.message });
  }
});

// ——————————————
// 6) START SERVER
// ——————————————
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
