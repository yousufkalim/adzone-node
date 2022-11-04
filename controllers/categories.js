/**
 * Sale Type CRUD controllers
 * @author Shuja Naqvi
 */
const Category = require('../models/Category');

/**
 * Create Category
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(404).json({ success: false, message: 'File Not Found' });
    }
    req.body.photo = req.file.path;
    const category = await Category.create(req.body); // Adding category in db
    // Done
    res.json({ success: true, category }); //Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get all categories
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const categories = await Category.find(); // Finding all the categories from db
    res.json({ success: true, categories }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get category by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const categoryId = req.params.categoryId; // Getting category id from URL parameter
    const category = await Category.findById(categoryId); // Finding category by id
    res.json({ success: true, category }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Update category
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const categoryId = req.params.categoryId; // Getting category id from URL parameter
    if (req.file) {
      req.body.photo = req.file.path;
    }
    const category = await Category.findByIdAndUpdate(categoryId, req.body, {
      new: true
    }); // Updating the category
    res.json({ success: true, category }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Delete Category
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const categoryId = req.params.categoryId; // Getting category id from URL parameter
    const category = await Category.findByIdAndDelete(categoryId); // Deleting the category
    res.json({ success: true, category }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
