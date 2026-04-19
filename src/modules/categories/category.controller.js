'use strict';

const Category = require('./category.model');

function notFound() {
  const err = new Error('Category not found.');
  err.statusCode = 404;
  return err;
}

function forbidden() {
  const err = new Error('You do not have permission to access this category.');
  err.statusCode = 403;
  return err;
}

/**
 * POST /api/categories
 */
async function createCategory(req, res) {
  const { name } = req.body;

  const category = await Category.create({
    name,
    userId: req.user.id,
  });

  res.status(201).json({
    status: 'success',
    message: 'Category created successfully.',
    data: { category },
  });
}

/**
 * GET /api/categories
 */
async function getAllCategories(req, res) {
  const categories = await Category.find({ userId: req.user.id }).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: { categories },
  });
}

/**
 * PATCH /api/categories/:id
 */
async function updateCategory(req, res) {
  const category = await Category.findById(req.params.id).catch(() => null);

  if (!category) throw notFound();
  if (category.userId !== req.user.id) throw forbidden();

  Object.assign(category, req.body);
  await category.save();

  res.status(200).json({
    status: 'success',
    message: 'Category updated successfully.',
    data: { category },
  });
}

/**
 * DELETE /api/categories/:id
 */
async function deleteCategory(req, res) {
  const category = await Category.findById(req.params.id).catch(() => null);

  if (!category) throw notFound();
  if (category.userId !== req.user.id) throw forbidden();

  await category.deleteOne();

  res.status(200).json({
    status: 'success',
    message: 'Category deleted successfully.',
    data: null,
  });
}

module.exports = { createCategory, getAllCategories, updateCategory, deleteCategory };
