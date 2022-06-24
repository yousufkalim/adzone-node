/**
 * Brand CRUD routes
 * @author Shuja Naqvi
 */
const router = require("express").Router();
const brand = require("../controllers/brands");
const { checkAdminAuth } = require("../middleware/adminAuth");
const {
  validateBrand,
  validateBrandFavourites,
  isValidated,
} = require("../middleware/validators");
const { upload } = require("../middleware/multer");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post brand create
 * @method get get all brands
 * @method get get brand by id
 * @method put update brand
 * @method delete delete brand
 */

// Create -brand
router.post(
  "/",
  checkAdminAuth,
  upload.single("image"),
  validateBrand,
  isValidated,
  brand.create
);

// Read
router.get("/", brand.getAll); // Get all brands at once
router.get("/:brandId", brand.getById); // Get one brand by it's id

// Update
router.put(
  "/:brandId",
  checkAdminAuth,
  upload.single("image"),
  validateBrand,
  isValidated,
  brand.update
);

// Delete
router.delete("/:brandId", checkAdminAuth, brand.delete); // delete a specific Sale by it's id

//Group
router.post("/groupbyCategory", brand.groupbyCategory); // Group Brands by categories
router.post(
  "/groupAdsbySaleType",
  validateBrandFavourites,
  isValidated,
  brand.groupAdsbySaleType
); // Group Brands by categories
// Export
module.exports = router;
