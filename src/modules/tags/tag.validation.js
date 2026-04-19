'use strict';

const Joi = require('joi');

const createTagSchema = Joi.object({
  name: Joi.string().trim().max(50).required().messages({
    'string.max': 'Tag name cannot exceed 50 characters.',
    'any.required': 'Tag name is required.',
  }),
});

const updateTagSchema = Joi.object({
  name: Joi.string().trim().max(50).optional(),
}).min(1).messages({
  'object.min': 'Provide at least one field to update.',
});

module.exports = { createTagSchema, updateTagSchema };
