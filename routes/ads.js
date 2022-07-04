/**
 * ad CRUD routes
 * @author Shuja Naqvi
 */
const router = require("express").Router();
const ad = require("../controllers/ads");
const { checkAdminAuth } = require("../middleware/adminAuth");
const {
  validateAd,
  validateSaleInterest,
  isValidated,
} = require("../middleware/validators");
const { upload } = require("../middleware/multer");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post ad create
 * @method get get all ads
 * @method get get ad by id
 * @method put update ad
 * @method delete delete ad
 */

// Create -ad
router.post(
  "/",
  checkAdminAuth,
  upload.single("image"),
  validateAd,
  isValidated,
  ad.create
);

// Read
router.get("/", ad.getAll); // Get all ads at once
router.get("/getTrendingAds", ad.trendingAds);
router.get("/:adId", ad.getById); // Get one ad by it's id

// Update
router.put(
  "/:adId",
  checkAdminAuth,
  upload.single("image"),
  validateAd,
  isValidated,
  ad.update
);

// Delete
router.delete("/:adId", checkAdminAuth, ad.delete); // delete a specific Sale by it's id

//getAdsbySaleId

router.post(
  "/getAdsbySaleId",
  validateSaleInterest,
  isValidated,
  ad.getAdsbySaleId
);

//groupbySaleType
router.post("/groupbySaleType", ad.groupbySaleType);
//Increase view of an ad
router.put("/increaseView/:adId", ad.increaseView);

// Export
module.exports = router;
