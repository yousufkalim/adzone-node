/**
 * User CRUD routes
 * @author Yousuf Kalim
 */
const router = require("express").Router();
const users = require("../controllers/users");
const { checkAdminAuth } = require("../middleware/adminAuth");
const { upload } = require("../middleware/multer");
const {
  validateUser,
  validateUserUpdate,
  validateNotificationSetting,
  validateAddress,
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
  upload.single("image"),
  validateUserUpdate,
  isValidated,
  users.update
); // Update a specific user by it's id
// Add Adress
router.put(
  "/addAddress/:userId",
  validateAddress,
  isValidated,
  users.addAddress
); // Update a specific user by it's id
//updateNotificationSetting
router.put(
  "/updateNotificationSetting/:userId",
  validateNotificationSetting,
  isValidated,
  users.updateNotificationSetting
); // Update a specific user by it's id

// Delete
router.delete("/:userId", checkAdminAuth, users.delete); // delete a specific user by it's id

// Export
module.exports = router;
