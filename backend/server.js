const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'TaskFlow API is running 🚀' });
});

// Connect to MongoDB (with automatic local JSON fallback if MongoDB is not running)
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 3000 })
  .then(() => {
    app.locals.useLocalDb = false;
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    app.locals.useLocalDb = true;
    console.warn(`⚠️ MongoDB unavailable (${err.message}). Using local JSON store (backend/data/db.json).`);
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT} (Local DB mode)`);
    });
  });
