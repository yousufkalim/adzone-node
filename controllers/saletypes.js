/**
 * Sale Type CRUD controllers
 * @author Shuja Naqvi
 */
const SaleType = require("../models/SaleType");

/**
 * Create Sale-Type
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    const sale = await SaleType.create(req.body); // Adding sale in db
    // Done
    res.json({ success: true, sale }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get all Sales
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const sales = await SaleType.find(); // Finding all the sales from db
    res.json({ success: true, sales }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get sale by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const saleId = req.params.saleId; // Getting sale id from URL parameter
    const sale = await SaleType.findById(saleId); // Finding sale by id
    res.json({ success: true, sale }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Update Sale
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const saleId = req.params.saleId; // Getting sale id from URL parameter

    const sale = await SaleType.findByIdAndUpdate(saleId, req.body, {
      new: true,
    }); // Updating the sale
    res.json({ success: true, sale }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Delete sale type
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const saleId = req.params.saleId; // Getting sale id from URL parameter
    const sale = await SaleType.findByIdAndDelete(saleId); // Deleting the sale
    res.json({ success: true, sale }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
