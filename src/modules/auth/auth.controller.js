'use strict';

const bcrypt = require('bcryptjs');
const { pool } = require('../../config/db.postgres');
const { signToken } = require('../../config/jwt');

/**
 * POST /api/auth/register
 */
async function register(req, res) {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 12);

  const { rows } = await pool.query(
    'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at',
    [email, hashed]
  );

  const user = rows[0];
  const token = signToken({ id: user.id, email: user.email });

  res.status(201).json({
    status: 'success',
    message: 'User registered successfully.',
    data: {
      user: { id: user.id, email: user.email, createdAt: user.created_at },
      token,
    },
  });
}

/**
 * POST /api/auth/login
 */
async function login(req, res) {
  const { email, password } = req.body;

  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = rows[0];

  if (!user) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  const token = signToken({ id: user.id, email: user.email });

  res.status(200).json({
    status: 'success',
    message: 'Logged in successfully.',
    data: {
      user: { id: user.id, email: user.email, createdAt: user.created_at },
      token,
    },
  });
}

/**
 * GET /api/auth/profile  (protected)
 */
async function getProfile(req, res) {
  const { rows } = await pool.query(
    'SELECT id, email, created_at FROM users WHERE id = $1',
    [req.user.id]
  );

  if (!rows[0]) {
    const err = new Error('User not found.');
    err.statusCode = 404;
    throw err;
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: { id: rows[0].id, email: rows[0].email, createdAt: rows[0].created_at },
    },
  });
}

module.exports = { register, login, getProfile };
