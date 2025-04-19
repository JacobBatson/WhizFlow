// server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const path = require('path');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// ——————————————
// 1) MONGO CONNECTION
// ——————————————
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in .env file');
  process.exit(1);
}
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// ——————————————
// 2) SESSION + PASSPORT SETUP
// ——————————————
const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  console.error('❌ SESSION_SECRET is not defined in .env file');
  process.exit(1);
}
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');

// ——————————————
// 3) SERVE STATIC FRONTEND
// ——————————————
app.use(express.static(path.join(__dirname, '../frontend')));
// Serve login.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'login.html'));
});

// ——————————————
// 4) GOOGLE OAUTH ROUTES
// ——————————————
app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: [
      'openid',
      'profile',
      'email',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/calendar.events'
    ],
    accessType: 'offline',
    prompt: 'consent'
  })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/dashboard');
  }
);

// ——————————————
// 5) PROTECTED DASHBOARD ROUTE
// ——————————————
app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.send(`Welcome, ${req.user.displayName}`);
});

// ——————————————
// 6) ERROR HANDLING
// ——————————————
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).send('Internal Server Error');
});



// ——————————————
// 7) START SERVER
// ——————————————
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
