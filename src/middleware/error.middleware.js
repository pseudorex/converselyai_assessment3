'use strict';

/**
 * Global error handling middleware.
 * All errors thrown in async routes are caught here.
 *
 * Shape of every error response:
 * {
 *   "status": "error",
 *   "statusCode": 4xx | 5xx,
 *   "message": "Human-readable description"
 * }
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Default to 500 if no status code is set
  let statusCode = err.statusCode || 500;

  // Handle mongoose validation errors
  if (err.name === 'ValidationError') statusCode = 400;
  
  // Handle mongoose CastError (like when someone passes a bad ObjectId)
  if (err.name === 'CastError') statusCode = 400;
  
  // Handle JWT errors from authentication
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') statusCode = 401;
  
  // PostgreSQL unique constraint violation (duplicate email)
  // Error code 23505 means unique_violation in PostgreSQL
  if (err.code === '23505') {
    statusCode = 409;
    err.message = 'A user with that email already exists.';
  }

  const message = statusCode === 500 && process.env.NODE_ENV === 'production'
    ? 'Internal Server Error'
    : err.message || 'Internal Server Error';

  if (statusCode === 500) {
    console.error('[ERROR]', err);
  }

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
}

module.exports = { errorHandler };
