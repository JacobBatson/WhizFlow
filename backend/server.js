// server.js
require('dotenv').config();
const express       = require('express');
const mongoose      = require('mongoose');
const session       = require('express-session');
const passport      = require('passport');
const path          = require('path');

const app = express();
app.use(express.json());

// ——————————————
// 1) MONGO CONNECTION
// ——————————————
console.log('MONGO_URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ DB connection error:', err));

// ——————————————
// 2) SESSION + PASSPORT SETUP
// ——————————————
// (a) Session middleware
app.use(session({
  secret:   process.env.SESSION_SECRET, 
  resave:   false,
  saveUninitialized: false
}));

// (b) Passport init
app.use(passport.initialize());
app.use(passport.session());

// (c) Load your Passport strategy config
//    Create this file next (see below)
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
// 5) START SERVER
// ——————————————
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const express = require('express');
const mongoose = require('mongoose');
const port = 3000;

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/whizflow', { userNewUrParser: true, useUnifiedTopology: true })
    .then (() => console.log('MongoDB connected'))
    .catch(err => console.error('failed to connect to MongoDB', err));
const taskScheme = new mongoose.Schema({
    task: {type: String, required: true},
    createdAt: {type: Date, default: Date.npw}
});
const Task = mongoose.model('Task', taskScheme);
app.post('/api/tasks', async (req, res) => {
    const{ task } = re.body;
    if(!task || task.trim() === ''){
        return res.status(400).jason({error: 'Task description is required'});
    }

    try {
        const newTask = new Task({ task});
        await newTask.save();

        res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (error){
        res.status(500).jsaon({ eroor: 'failed to create task. Please try again later', error: error.message });
    }
});
app.listen(port, () => {
    console.log('Backenndd runnong at http://localhost;${port}');
})
