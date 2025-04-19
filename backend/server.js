const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// Middleware to parse JSON
app.use(express.json());

// ——————————————
// 1) MONGO CONNECTION
// ——————————————
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in .env file');
  process.exit(1); // Exit the application if MONGO_URI is missing
}

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit the application if MongoDB connection fails
  });

// ——————————————
// 2) SESSION + PASSPORT SETUP
// ——————————————
const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  console.error('❌ SESSION_SECRET is not defined in .env file');
  process.exit(1); // Exit the application if SESSION_SECRET is missing
}

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport'); // Ensure Passport is configured in this file

// ——————————————
// 3) ROUTES
// ——————————————
// Google OAuth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard'); // Redirect to a protected route after successful login
  }
);

// Example protected route
app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.send(`Welcome, ${req.user.displayName}`);
});

// ——————————————
// 4) SERVE STATIC FILES
// ——————————————
app.use('/WhizFlow/frontend', express.static(path.join(__dirname, '../frontend')));

// ——————————————
// 5) ERROR HANDLING
// ——————————————
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).send('Internal Server Error');
});

// ——————————————
// 6) START SERVER
// ——————————————
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});