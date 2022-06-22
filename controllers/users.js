/**
 * User CRUD controllers
 * @author Shuja Naqvi
 */
const Users = require("../models/User");
const bcrypt = require("bcryptjs");
const bcryptSalt = process.env.BCRYPT_SALT || 10;

/**
 * Create User - Signup
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    let { email, password } = req.body; // Getting required fields from body
    const existingUser = await Users.findOne({ email }); // Finding already existing user

    // Extra Validations
    if (existingUser) {
      // If we found existing user in db
      return res
        .status(409)
        .json({ success: false, message: "User already exists." });
    }

    // Getting url of the image
    if (req.file) {
      req.body.photo = req.file.path; // Creating a new property called photo in body object
    }

    // Creating User
    req.body.password = bcrypt.hashSync(password, parseInt(bcryptSalt)); // Hashing the password with salt 8
    const user = await Users.create(req.body); // Adding user in db

    // Done
    res.json({ success: true, user }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get all users
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const users = await Users.find(); // Finding all the users from db
    res.json({ success: true, users }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get user by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    const user = await Users.findById(userId); // Finding user by id
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Update user
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    // Getting url of the image
    if (req.file) {
      req.body.photo = req.file.path; // Creating a new property called photo in body object
    }
    // If user want to update it's password

    if (req.body.password) {
      req.body.password = bcrypt.hashSync(
        req.body.password,
        parseInt(bcryptSalt)
      );
    }

    const user = await Users.findByIdAndUpdate(userId, req.body, { new: true }); // Updating the user
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Add Address of  user
 * @param {object} req
 * @param {object} res
 */
exports.addAddress = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    const { address } = req.body;

    const user = await Users.findByIdAndUpdate(
      userId,
      { $push: { locations: address } },
      { new: true }
    ); // Updating the user
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Delete user
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    const user = await Users.findByIdAndDelete(userId); // Deleting the user
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Set Notification of user
 * @param {object} req
 * @param {object} res
 */
exports.updateNotificationSetting = async (req, res) => {
  try {
    const userId = req.params; // Getting user id from URL parameter
    const { notification } = req.body;
    const user = await Users.findByIdAndUpdate(
      userId,
      { notification_setting: notification },
      { new: true }
    ); // Deleting the user
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Add Product  into  favourites  of user
 * @param {object} req
 * @param {object} res
 */
exports.AddAdFavourites = async (req, res) => {
  try {
    const { userId } = req.params; // Getting user id from URL parameter
    const { ad } = req.body;
    const existingFav = await Users.findOne({
      _id: userId,
      "favourites.ads": ad,
    });
    if (existingFav) {
      return res.status(404).json({
        success: false,
        message: "Already Added into Your Favourites",
      });
    }
    const user = await Users.findByIdAndUpdate(
      userId,
      { $push: { favourites: { ads: ad } } },
      { new: true }
    );
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Remove Product  from  favourites  of user
 * @param {object} req
 * @param {object} res
 */
exports.RemoveAdFavourites = async (req, res) => {
  try {
    const { userId } = req.params; // Getting user id from URL parameter
    const { ad } = req.body;
    const existingFav = await Users.findOne({
      _id: userId,
      "favourites.ads": ad,
    });
    if (!existingFav) {
      return res.status(404).json({
        success: false,
        message: "Already Removed",
      });
    }
    const user = await Users.findByIdAndUpdate(
      userId,
      { $pull: { favourites: { ads: ad } } },
      { new: true }
    );
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Add Brand  into  favourites  of user
 * @param {object} req
 * @param {object} res
 */
exports.AddBrandFavourites = async (req, res) => {
  try {
    const { userId } = req.params; // Getting user id from URL parameter
    const { brand } = req.body;
    const existingFav = await Users.findOne({
      _id: userId,
      "favourites.brands": brand,
    });
    if (existingFav) {
      return res.status(404).json({
        success: false,
        message: "Already Added into Your Favourites",
      });
    }
    const user = await Users.findByIdAndUpdate(
      userId,
      { $push: { favourites: { brands: brand } } },
      { new: true }
    );
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Remove Brand  from  favourites  of user
 * @param {object} req
 * @param {object} res
 */
exports.RemoveBrandFavourites = async (req, res) => {
  try {
    const { userId } = req.params; // Getting user id from URL parameter
    const { brand } = req.body;
    const existingFav = await Users.findOne({
      _id: userId,
      "favourites.brands": brand,
    });
    if (!existingFav) {
      return res.status(404).json({
        success: false,
        message: "Already Removed",
      });
    }
    const user = await Users.findByIdAndUpdate(
      userId,
      { $pull: { favourites: { brands: brand } } },
      { new: true }
    );
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
