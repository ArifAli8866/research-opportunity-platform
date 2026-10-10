// ==============================================================
// Global Error and 404 Handlers
// ==============================================================
// Handles unknown API routes and uncaught exceptions gracefully.
// ==============================================================

/**
 * 404 Not Found Handler for unknown API routes
 * Returns 404 with JSON { "error": "API route not found" }
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({ error: 'API route not found' });
};

/**
 * Global Error Handler
 * Logs the actual error stack to the console and returns 500 JSON { error: "Internal server error" }
 */
const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Application Error:', err);

  // If response headers have already been sent, delegate to Express default handler
  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({ error: 'Internal server error' });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
