// ==============================================================
// Research Opportunity Portal - Server Entry Point
// ==============================================================
// This file sets up the Express application, serves static frontend
// files, configures standard middleware, and starts the HTTP server.
// ==============================================================

const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');

// Load environment variables from backend/.env or root .env
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const db = require('./src/config/db');
const opportunityRoutes = require('./src/routes/opportunityRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable Cross-Origin Resource Sharing (CORS) for API requests
app.use(cors());

// Parse incoming JSON payloads and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static assets (HTML, CSS, JS) from the frontend/ folder
const frontendPath = path.resolve(__dirname, '../frontend');
app.use(express.static(frontendPath));

// API Routes
app.use('/api/opportunities', opportunityRoutes);

// Health check endpoint to verify backend and database connectivity
app.get('/api/health', async (req, res) => {
  try {
    // Execute a simple query to confirm database connectivity
    await db.query('SELECT 1');
    res.status(200).json({ status: 'OK', message: 'Backend and Database connected successfully' });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: 'Database connection failed', error: error.message });
  }
});

// Root route: Serve frontend index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Research Opportunity Portal running at http://localhost:${PORT}`);
});

module.exports = app;
