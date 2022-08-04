/**
 * Tags CRUD controllers
 * @author Shuja Naqvi
 * //
 */
const Tag = require('../models/Tag');

/**
 * Create tag
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    const tag = await Tag.create(req.body); // Adding tag in db
    // Done
    res.json({ success: true, tag }); //Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get all tags
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const tags = await Tag.find(); // Finding all the tags from db
    res.json({ success: true, tags }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get tag by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const tagId = req.params.tagId; // Getting tag id from URL parameter
    const tag = await Tag.findById(tagId); // Finding tag by id
    res.json({ success: true, tag }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Update tag
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const tagId = req.params.tagId; // Getting tag id from URL parameter

    const tag = await Tag.findByIdAndUpdate(tagId, req.body, {
      new: true,
    }); // Updating the tag
    res.json({ success: true, tag }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Delete tag
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const tagId = req.params.tagId; // Getting tag id from URL parameter
    const tag = await Tag.findByIdAndDelete(tagId); // Deleting the tag
    res.json({ success: true, tag }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
