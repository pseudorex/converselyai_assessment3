'use strict';

const { verifyToken } = require('../config/jwt');

/**
 * Middleware — verifies the Bearer JWT in `Authorization` header.
 * Attaches decoded user payload to `req.user`.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    const err = new Error('No token provided. Please log in.');
    err.statusCode = 401;
    return next(err);
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // { id, email, iat, exp }
    next();
  } catch {
    const err = new Error('Invalid or expired token.');
    err.statusCode = 401;
    next(err);
  }
}

module.exports = { authenticate };
