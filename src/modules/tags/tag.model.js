'use strict';

const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tag name is required.'],
      trim: true,
      maxlength: [50, 'Tag name cannot exceed 50 characters.'],
    },
    userId: {
      type: Number,
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

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
