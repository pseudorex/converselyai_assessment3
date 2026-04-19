'use strict';

const Tag = require('./tag.model');

function notFound() {
  const err = new Error('Tag not found.');
  err.statusCode = 404;
  return err;
}

function forbidden() {
  const err = new Error('You do not have permission to access this tag.');
  err.statusCode = 403;
  return err;
}

async function createTag(req, res) {
  const { name } = req.body;

  const tag = await Tag.create({
    name,
    userId: req.user.id,
  });

  res.status(201).json({
    status: 'success',
    message: 'Tag created successfully.',
    data: { tag },
  });
}

async function getAllTags(req, res) {
  const tags = await Tag.find({ userId: req.user.id }).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: tags.length,
    data: { tags },
  });
}

async function updateTag(req, res) {
  const tag = await Tag.findById(req.params.id).catch(() => null);

  if (!tag) throw notFound();
  if (tag.userId !== req.user.id) throw forbidden();

  Object.assign(tag, req.body);
  await tag.save();

  res.status(200).json({
    status: 'success',
    message: 'Tag updated successfully.',
    data: { tag },
  });
}

async function deleteTag(req, res) {
  const tag = await Tag.findById(req.params.id).catch(() => null);

  if (!tag) throw notFound();
  if (tag.userId !== req.user.id) throw forbidden();

  await tag.deleteOne();

  res.status(200).json({
    status: 'success',
    message: 'Tag deleted successfully.',
    data: null,
  });
}

module.exports = { createTag, getAllTags, updateTag, deleteTag };
