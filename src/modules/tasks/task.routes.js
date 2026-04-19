'use strict';

const express = require('express');
const router = express.Router();

const { authenticate } = require('../../middleware/auth.middleware');
const { validate } = require('../../middleware/validate');
const { createTaskSchema, updateTaskSchema } = require('./task.validation');
const {
  createTask, getAllTasks, getTaskById, updateTask, deleteTask,
} = require('./task.controller');

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management (all routes require authentication)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 661f1c2e8a1b2c3d4e5f6789
 *         title:
 *           type: string
 *           example: Buy groceries
 *         description:
 *           type: string
 *           example: Milk, eggs, bread
 *         dueDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2025-12-31T00:00:00.000Z
 *         status:
 *           type: string
 *           enum: [pending, completed]
 *           example: pending
 *         category:
 *           type: string
 *           nullable: true
 *           example: 661f1c2e8a1b2c3d4e5f6789
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Work", "Urgent"]
 *         userId:
 *           type: integer
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Buy groceries
 *               description:
 *                 type: string
 *                 example: Milk, eggs, bread
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-31"
 *               status:
 *                 type: string
 *                 enum: [pending, completed]
 *                 example: pending
 *               category:
 *                 type: string
 *                 example: 661f1c2e8a1b2c3d4e5f6789
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Work", "Urgent"]
 *     responses:
 *       201:
 *         description: Task created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, validate(createTaskSchema), createTask);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks for the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category ID to filter tasks
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Comma-separated tags to filter tasks (example: tags=Urgent,ClientA)
 *     responses:
 *       200:
 *         description: List of tasks
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, getAllTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a single task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the task
 *     responses:
 *       200:
 *         description: Task object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (task belongs to another user)
 *       404:
 *         description: Task not found
 */
router.get('/:id', authenticate, getTaskById);

/**
 * @swagger
 * /api/tasks/{id}:
 *   patch:
 *     summary: Partially update a task
 *     tags: [Tasks]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [pending, completed]
 *               category:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Updated task
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.patch('/:id', authenticate, validate(updateTaskSchema), updateTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
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
 *         description: Task deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.delete('/:id', authenticate, deleteTask);

module.exports = router;
