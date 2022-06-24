/**
 * User CRUD routes
 * @author Shuja Naqvi
 */
const router = require("express").Router();
const users = require("../controllers/users");
const { checkAdminAuth } = require("../middleware/adminAuth");
const { checkAuth } = require("../middleware/checkAuth");

// const { validateUserId } = require("../middleware/validateIds");
const { upload } = require("../middleware/multer");
const {
  validateUser,
  validateUserUpdate,
  validateNotificationSetting,
  validateFavourites,
  validateAddress,
  validateBrandFavourites,
  validateCategoryInterest,
  validateSaleInterest,
  isValidated,
} = require("../middleware/validators");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post user signup
 * @method get get all users
 * @method get get user by id
 * @method put update user
 * @method delete delete user
 */

// Create - User Signup
router.post(
  "/",
  upload.single("image"),
  validateUser,
  isValidated,
  users.create
);

// Read
router.get("/", checkAdminAuth, users.getAll); // Get all users at once
router.get("/:userId", users.getById); // Get one user by it's id

// Update
router.put(
  "/:userId",
  checkAuth,
  upload.single("image"),
  validateUserUpdate,
  isValidated,
  users.update
);
// Add Adress
router.put(
  "/addAddress/:userId",
  checkAuth,
  validateAddress,
  isValidated,
  users.addAddress
);
//updateNotificationSetting
router.put(
  "/updateNotificationSetting/:userId",
  checkAuth,
  validateNotificationSetting,
  isValidated,
  users.updateNotificationSetting
);
//ADD Product to  Favourites
router.put(
  "/Addtofavourite/:userId",
  checkAuth,
  validateFavourites,
  isValidated,
  users.AddtoFavourites
);

//Removed Product to  Favourites
router.put(
  "/RemoveFavourites/:userId",
  checkAuth,
  validateFavourites,
  isValidated,
  users.RemoveFavourites
);

//ADD Sale to  Interest
router.put(
  "/InterestSale/:userId",
  checkAuth,
  validateSaleInterest,
  isValidated,
  users.AddSaleInterest
);
//ADD Brand to  Interest
router.put(
  "/InterestBrand/:userId",
  checkAuth,
  validateBrandFavourites,
  isValidated,
  users.AddBrandInterest
);
//ADD Category to  Interest
router.put(
  "/InterestCategory/:userId",
  checkAuth,
  validateCategoryInterest,
  isValidated,
  users.AddCatgoryInterest
);

// router.post("/checkuser/:userId", validateUserId, users.checkUser);

// Delete
router.delete("/:userId", checkAdminAuth, users.delete); // delete a specific user by it's id

// Export
module.exports = router;
