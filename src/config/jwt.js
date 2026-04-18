'use strict';

const jwt = require('jsonwebtoken');

/**
 * Sign a JWT for the given payload.
 * @param {object} payload
 * @returns {string} signed token
 */
function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

/**
 * Verify and decode a JWT.
 * @param {string} token
 * @returns {object} decoded payload
 */
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { signToken, verifyToken };
