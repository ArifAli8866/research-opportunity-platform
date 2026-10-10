// ==============================================================
// Database Configuration and Connection Pool
// ==============================================================
// We use the `mysql2/promise` module to create a connection pool.
// Connection pooling reuses established connections, reducing latency
// and overhead caused by constantly opening and closing TCP connections.
// ==============================================================

const path = require('path');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

// Load environment variables from backend/.env or root .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Create a MySQL connection pool using environment variables with sensible defaults
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'research_portal',
  waitForConnections: true, // Queue requests when all connections are active
  connectionLimit: 10,       // Maximum number of active connections in pool
  queueLimit: 0,             // Unlimited queue length (0 means no limit)
  dateStrings: true          // Return MySQL DATE types as 'YYYY-MM-DD' strings to prevent timezone shifts
});

module.exports = pool;
