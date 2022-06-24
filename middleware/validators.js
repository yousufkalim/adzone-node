/**
 * All the validation
 * @author Shuja
 */
const { check, validationResult } = require("express-validator");

/*
====================
Validations
====================
*/

// You can create multiple validations strategies (Read express-validator documentation for more details)
// User Signup Validation
exports.validateUser = [
  check("name", "Name is required. ").notEmpty().trim(),
  check("email", "Email is required.").notEmpty().isEmail().trim(),
  check("password", "Password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
];

// User Signup Validation
exports.validateUserUpdate = [
  check("name", "Name is required.").notEmpty().trim(),
];
//Validate Create Sale Type
exports.validateSale = [check("name", "Name is required.").notEmpty().trim()];
//Validate Create Category
exports.validateCategory = [
  check("name", "Name is required.").notEmpty().trim(),
];
//Validate Create Category
exports.validateBrand = [
  check("name", "Name is required.").notEmpty().trim(),
  check("about", "About is required.").notEmpty().trim(),
  check("category", "categoryId is required.").notEmpty().trim(),
  check("founded_on", "founded_on is required.").notEmpty().trim(),
  check("annual_sale", "annual_sale is required.").notEmpty().trim(),
];
//validatestore
exports.validatestore = [
  check("name", "Name is required.").notEmpty().trim(),
  check("brand", "brandId is required.").notEmpty().trim(),
  check("location.area", "area is required.").notEmpty().trim(),
  check("location.city", "city is required.").notEmpty().trim(),
  check("location.lat", "lat is required.").notEmpty().trim(),
  check("location.lng", "lng is required.").notEmpty().trim(),
];
//validateAd
exports.validateAd = [
  check("name", "Name is required.").notEmpty().trim(),
  check("brand", "brandId is required.").notEmpty().trim(),
  check("category", "categoryId is required.").notEmpty().trim(),
  check("sale_type", "SaleTypeId is required.").notEmpty().trim(),
  check("sale_date.start_date", "sale_date.start_date is required.")
    .notEmpty()
    .trim(),
  check("sale_date.end_date", "sale_date.end_date is required.")
    .notEmpty()
    .trim(),
];

exports.validateAddress = [
  check("address.area", "area is required.").notEmpty().trim(),
  check("address.city", "city is required.").notEmpty().trim(),
  check("address.lat", "lat is required.").notEmpty().trim(),
  check("address.lng", "lng is required.").notEmpty().trim(),
];
exports.validateNotificationSetting = [
  check("notification.brand", "Brand is required.").notEmpty().isBoolean(),
  check("notification.phone", "Phone is required.").notEmpty().isBoolean(),
  check("notification.email", "Email is required.").notEmpty().isBoolean(),
  check("notification.sale", "sale is required. ").notEmpty().isBoolean(),
];

exports.validateFavourites = [
  check("favid", "favid Id is required.").notEmpty().trim(),
];
exports.validateBrandFavourites = [
  check("brand", "Brand Id is required.").notEmpty().trim(),
];

exports.validateSaleInterest = [
  check("sale", "SaleTypeId is required.").notEmpty().trim(),
];
exports.validateCategoryInterest = [
  check("category", "categoryId is required.").notEmpty().trim(),
];
// Login validation
exports.validateLogin = [
  check("email", "Email is required").notEmpty().isEmail().trim().toLowerCase(),
  check("password", "Password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
];

exports.validateOtp = [check("otp", "otp is required.").notEmpty().trim()];

// Change password validation
exports.changePasswordValidate = [
  check("oldPassword", "Old Password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
  check("newPassword", "New password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
  check("confirmPassword", "Confirm password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
];

/*
======================
Result
======================
*/

/**
 * To check if request validated successfully or not, according to our validation strategies
 * @param {object} req
 * @param {object} res
 * @param {*} next
 */
exports.isValidated = (req, res, next) => {
  const errors = validationResult(req); // Validating the request by previous middleware's strategy
  if (!errors.isEmpty()) {
    // On error
    res.status(400).send({ success: false, message: errors.array()[0] }); // Sending first error to the client from array of errors
  } else {
    // Validated successfully
    next(); // Pass the request to next middleware or controller
  }
};
