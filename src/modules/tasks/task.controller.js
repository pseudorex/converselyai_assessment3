'use strict';

const Task = require('./task.model');
const { agenda } = require('../../config/agenda');
const { cancelTaskReminder, scheduleTaskReminder } = require('../../services/reminder.service');

// Helper functions for errors

function notFound() {
  const err = new Error('Task not found.');
  err.statusCode = 404;
  return err;
}

function forbidden() {
  const err = new Error('You do not have permission to access this task.');
  err.statusCode = 403;
  return err;
}

// Controller functions for tasks

/**
 * POST /api/tasks
 * Creates a new task for the authenticated user
 */
async function createTask(req, res) {
  const { title, description, dueDate, status, category, tags } = req.body;

  const task = await Task.create({
    title,
    description,
    dueDate: dueDate || null,
    status: status || 'pending',
    category: category || null,
    tags: tags || [],
    userId: req.user.id,
  });

  await scheduleTaskReminder(task);

  if (task.status === 'completed') {
    await agenda.now('send completed webhook', {
      taskId: task._id.toString(),
      title: task.title,
      completedAt: new Date(),
      userId: req.user.id,
      retryCount: 0,
    });
  }

  res.status(201).json({
    status: 'success',
    message: 'Task created successfully.',
    data: { task },
  });
}

/**
 * GET /api/tasks
 * Returns all tasks belonging to the authenticated user
 * TODO: Add pagination in future versions (e.g., ?page=1&limit=10)
 * TODO: Add filtering by status (e.g., ?status=completed)
 */
async function getAllTasks(req, res) {
  const { category, tags } = req.query;
  const filter = { userId: req.user.id };

  if (category) {
    filter.category = category;
  }

  if (tags) {
    const tagsArray = tags.split(',').map((t) => t.trim());
    filter.tags = { $all: tagsArray };
  }

  // Find all tasks where userId matches the authenticated user
  const tasks = await Task.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: tasks.length,
    data: { tasks },
  });
}

/**
 * GET /api/tasks/:id
 * Gets a single task by its ID, checking that the user owns it
 */
async function getTaskById(req, res) {
  const task = await Task.findById(req.params.id).catch(() => null);

  if (!task) throw notFound();
  
  // Make sure the user requesting the task is the owner
  if (task.userId !== req.user.id) throw forbidden();

  res.status(200).json({
    status: 'success',
    data: { task },
  });
}

/**
 * PATCH /api/tasks/:id
 * Updates specific fields on a task
 */
async function updateTask(req, res) {
  const task = await Task.findById(req.params.id).catch(() => null);

  if (!task) throw notFound();
  if (task.userId !== req.user.id) throw forbidden();

  const statusChangedToCompleted = req.body.status === 'completed' && task.status !== 'completed';

  // Apply only the fields sent in the request
  Object.assign(task, req.body);
  await task.save();

  await cancelTaskReminder(task._id.toString());
  await scheduleTaskReminder(task);

  if (statusChangedToCompleted) {
    await agenda.now('send completed webhook', {
      taskId: task._id.toString(),
      title: task.title,
      completedAt: new Date(),
      userId: req.user.id,
      retryCount: 0,
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Task updated successfully.',
    data: { task },
  });
}

/**
 * DELETE /api/tasks/:id
 * Removes a task from the database completely
 */
async function deleteTask(req, res) {
  const task = await Task.findById(req.params.id).catch(() => null);

  if (!task) throw notFound();
  if (task.userId !== req.user.id) throw forbidden();

  await cancelTaskReminder(task._id.toString());
  await task.deleteOne();

  res.status(200).json({
    status: 'success',
    message: 'Task deleted successfully.',
    data: null,
  });
}

module.exports = { createTask, getAllTasks, getTaskById, updateTask, deleteTask };
