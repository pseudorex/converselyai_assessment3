'use strict';

const express = require('express');
const router = express.Router();

const { receiveWebhook } = require('./webhook.controller');

/**
 * @swagger
 * tags:
 *   name: Webhook Receiver
 *   description: Simulated external webhook receiver for analytics integration
 */

/**
 * @swagger
 * /api/webhook/receive:
 *   post:
 *     summary: Receive a webhook payload for completed tasks
 *     tags: [Webhook Receiver]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               title:
 *                 type: string
 *               completionDate:
 *                 type: string
 *                 format: date-time
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Webhook payload received
 */
router.post('/receive', receiveWebhook);

module.exports = router;
