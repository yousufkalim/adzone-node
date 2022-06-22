/**
 * Store CRUD controllers
 * @author Shuja Naqvi
 */
const Stores = require("../models/Store");
const Brands = require("../models/Brand");

/**
 * Create  store
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    // Getting url of the image
    if (req.file) {
      req.body.picture = req.file.path; // Creating a new property called photo in body object
    }
    const brand = await Brands.findById(req.body.brand); // Finding brand by id
    if (!brand) {
      return res.json({ success: false, message: "Brand not exist" }); //Success
    }
    const store = await Stores.create(req.body); // Adding store in db
    brand.stores.push(store._id);
    await brand.save();
    // Done
    res.json({ success: true, store }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get all stores
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const stores = await Stores.find(); // Finding all the stores from db
    res.json({ success: true, stores }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get store by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const storeId = req.params.storeId; // Getting store id from URL parameter
    const store = await Stores.findById(storeId)
      .populate("brand")
      .populate("category")
      .populate("sale_type"); // Finding store by id
    res.json({ success: true, store }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Update store
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const storeId = req.params.storeId; // Getting store id from URL parameter
    // Getting url of the image
    if (req.file) {
      req.body.picture = req.file.path; // Creating a new property called photo in body object
    }
    const store = await Stores.findByIdAndUpdate(storeId, req.body, {
      new: true,
    }); // Updating the brand
    res.json({ success: true, store }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Delete store
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const storeId = req.params.storeId; // Getting store id from URL parameter
    const store = await Stores.findByIdAndDelete(storeId); // Deleting the store
    res.json({ success: true, store }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
