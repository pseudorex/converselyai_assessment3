'use strict';

const express = require('express');
const router = express.Router();

const { register, login, getProfile } = require('./auth.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { validate } = require('../../middleware/validate');
const { registerSchema, loginSchema } = require('./auth.validation');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and profile
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: alice@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: secret123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
router.post('/register', validate(registerSchema), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in and receive a JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: alice@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Logged in successfully — includes JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validate(loginSchema), login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/profile', authenticate, getProfile);

module.exports = router;
