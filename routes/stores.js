/**
 * Store CRUD routes
 * @author Shuja Naqvi
 */
const router = require("express").Router();
const store = require("../controllers/stores");
const { checkAdminAuth } = require("../middleware/adminAuth");
const { validatestore, isValidated } = require("../middleware/validators");
const { upload } = require("../middleware/multer");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post store create
 * @method get get all stores
 * @method get get store by id
 * @method put update store
 * @method delete delete store
 */

// Create -store
router.post(
  "/",
  checkAdminAuth,
  upload.single("image"),
  validatestore,
  isValidated,
  store.create
);

// Read
router.get("/", store.getAll); // Get all stores at once
router.get("/:storeId", store.getById); // Get one store by it's id

// Update
router.put(
  "/:storeId",
  checkAdminAuth,
  upload.single("image"),
  validatestore,
  isValidated,
  store.update
);

// Delete
router.delete("/:storeId", checkAdminAuth, store.delete); // delete a specific Sale by it's id

// Export
module.exports = router;
