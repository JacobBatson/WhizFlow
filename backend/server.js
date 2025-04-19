const express = require('express');
const mongoose = require('mongoose'); // ✅ <- This was missing
require('dotenv').config();

const app = express();
app.use(express.json());

// Check .env value
console.log('MONGO_URI:', process.env.MONGO_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ DB connection error:', err));

// Basic test route
app.get('/', (req, res) => {
  res.send('Hello from TaskWhiz backend!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
