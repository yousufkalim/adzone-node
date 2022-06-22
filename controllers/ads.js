/**
 * Brand CRUD controllers
 * @author Shuja Naqvi
 */
const Brands = require("../models/Brand");
const Ads = require("../models/Ad");
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
    const brand = await Brands.findById(req.body.brand); // Finding brand by id
    if (!brand) {
      return res.json({ success: false, message: "Brand not exist" }); //Success
    }
    const ad = await Ads.create(req.body); // Adding store in db
    brand.ads.push(ad._id);
    await brand.save();
    // Done
    res.json({ success: true, ad }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get all ad
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const ad = await Ads.find()
      .populate("category")
      .populate("sale_type")
      .populate("brand"); // Finding all the ad from db
    res.json({ success: true, ad }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get ad by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const adId = req.params.adId; // Getting ad id from URL parameter
    const ad = await Ads.findById(adId)
      .populate("category")
      .populate("sale_type")
      .populate("brand"); // Finding ad by id
    res.json({ success: true, ad }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Update ad
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const adId = req.params.adId; // Getting ad id from URL parameter
    // Getting url of the image
    if (req.file) {
      req.body.picture = req.file.path; // Creating a new property called photo in body object
    }
    const ad = await Ads.findByIdAndUpdate(adId, req.body, {
      new: true,
    }); // Updating the ad
    res.json({ success: true, ad }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Delete Ads
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const adId = req.params.adId; // Getting ad id from URL parameter
    const ad = await Ads.findByIdAndDelete(adId); // Deleting the ad
    res.json({ success: true, ad }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
