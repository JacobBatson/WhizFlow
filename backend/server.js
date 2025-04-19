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

// ——————————————
// 4) SERVE FRONTEND
// ——————————————
app.use(express.static(path.join(__dirname, 'frontend')));

// ——————————————
// 5) START SERVER
// ——————————————
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
