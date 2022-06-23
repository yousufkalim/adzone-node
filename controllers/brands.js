/**
 * Brand CRUD controllers
 * @author Shuja Naqvi
 */
const Brands = require("../models/Brand");

/**
 * Create brand
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    // Getting url of the image
    if (req.file) {
      req.body.picture = req.file.path; // Creating a new property called photo in body object
    }
    const brand = await Brands.create(req.body); // Adding brand in db
    // Done
    res.json({ success: true, brand }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get all brands
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const brands = await Brands.find(); // Finding all the brands from db
    res.json({ success: true, brands }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get brand by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const brandId = req.params.brandId; // Getting brand id from URL parameter
    const brand = await Brands.findById(brandId); // Finding brand by id
    res.json({ success: true, brand }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Update brand
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const brandId = req.params.brandId; // Getting brand id from URL parameter
    // Getting url of the image
    if (req.file) {
      req.body.picture = req.file.path; // Creating a new property called photo in body object
    }
    const brand = await Brands.findByIdAndUpdate(brandId, req.body, {
      new: true,
    }); // Updating the brand
    res.json({ success: true, brand }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Delete Brand
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const brandId = req.params.brandId; // Getting brand id from URL parameter
    const brand = await Brands.findByIdAndDelete(brandId); // Deleting the brand
    res.json({ success: true, brand }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
