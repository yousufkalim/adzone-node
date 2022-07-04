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
  validateAddress,
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
router.get(
  "/getTrendingBrands",
  validateAddress,
  isValidated,
  brand.trendingBrands
); //Get Trending Brands
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

//get NearBy stores of a brand
router.get(
  "/getStoresByBrand/:brandId",
  validateAddress,
  isValidated,
  brand.getStoresByBrand
);

router.get(
  "/getPopulatStore/:brandId",
  validateAddress,
  isValidated,
  brand.getStoresByBrand
);
//Increase view of a brand
router.put("/increaseView/:brandId", brand.increaseView);
// Export
module.exports = router;
