'use strict';

const Joi = require('joi');

const createTaskSchema = Joi.object({
  title: Joi.string().trim().max(200).required().messages({
    'string.max': 'Title cannot exceed 200 characters.',
    'any.required': 'Task title is required.',
  }),
  description: Joi.string().trim().max(2000).optional().allow(''),
  dueDate: Joi.date().iso().optional().allow(null).messages({
    'date.format': 'Due date must be a valid ISO 8601 date (e.g. 2025-12-31).',
  }),
  status: Joi.string().valid('pending', 'completed').optional(),
  category: Joi.string().hex().length(24).optional().allow(null),
  tags: Joi.array().items(Joi.string().trim()).optional(),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().trim().max(200).optional(),
  description: Joi.string().trim().max(2000).optional().allow(''),
  dueDate: Joi.date().iso().optional().allow(null),
  status: Joi.string().valid('pending', 'completed').optional(),
  category: Joi.string().hex().length(24).optional().allow(null),
  tags: Joi.array().items(Joi.string().trim()).optional(),
}).min(1).messages({
  'object.min': 'Provide at least one field to update.',
});

module.exports = { createTaskSchema, updateTaskSchema };
