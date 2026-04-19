'use strict';

const express = require('express');
const router = express.Router();

const { authenticate } = require('../../middleware/auth.middleware');
const { validate } = require('../../middleware/validate');
const { createTagSchema, updateTagSchema } = require('./tag.validation');
const { createTag, getAllTags, updateTag, deleteTag } = require('./tag.controller');

/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: Tag management for tasks
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Tag:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         userId:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/tags:
 *   post:
 *     summary: Create a new tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tag created
 */
router.post('/', authenticate, validate(createTagSchema), createTag);

/**
 * @swagger
 * /api/tags:
 *   get:
 *     summary: Get all tags for the authenticated user
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tags
 */
router.get('/', authenticate, getAllTags);

/**
 * @swagger
 * /api/tags/{id}:
 *   patch:
 *     summary: Update a tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tag updated
 */
router.patch('/:id', authenticate, validate(updateTagSchema), updateTag);

/**
 * @swagger
 * /api/tags/{id}:
 *   delete:
 *     summary: Delete a tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tag deleted
 */
router.delete('/:id', authenticate, deleteTag);

module.exports = router;
