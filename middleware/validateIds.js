/**
 * Validate Ids
 * @author Shuja Naqvi
 */
const Users = require("../models/User");
const Ads = require("../models/Ad");
const Brands = require("../models/Brand");

exports.validateUserId = async (req, res, next) => {
  try {
    const userId = req.body.user ? req.body.user : req.params.userId;
    const user = await Users.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User NOT FOUND.... :(" });
    }
    next();
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.ValidateAdId = async (req, res, next) => {
  try {
    const ad = await Ads.findById(req.body.ad);
    if (!ad) {
      return res
        .status(404)
        .json({ success: false, message: "AD NOT FOUND.... :(" });
    }
    next();
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.ValidateBrandId = async (req, res, next) => {
  try {
    const ad = await Ads.findById(req.body.ad);
    if (!ad) {
      return res
        .status(404)
        .json({ success: false, message: "AD NOT FOUND.... :(" });
    }
    next();
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
