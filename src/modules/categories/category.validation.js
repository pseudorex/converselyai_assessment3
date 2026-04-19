'use strict';

const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().trim().max(50).required(),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().trim().max(50).required(),
}).min(1);

module.exports = { createCategorySchema, updateCategorySchema };
