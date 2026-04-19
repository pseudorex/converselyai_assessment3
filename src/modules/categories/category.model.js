'use strict';

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required.'],
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters.'],
    },
    userId: {
      type: Number, // references PostgreSQL users.id
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: false },
  }
);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
