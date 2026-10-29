const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cropRoutes = require('./routes/cropRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/crops', cropRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
  });

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Farmora API!',
    status: 'Server is running',
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Farmora backend is healthy',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Farmora server running at http://localhost:${PORT}`);
});