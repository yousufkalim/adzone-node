/**
 * Brand CRUD routes
 * @author Shuja Naqvi
 */
const router = require('express').Router();
const brand = require('../controllers/brands');
const { checkAdminAuth } = require('../middleware/adminAuth');
const {
  validateBrand,
  validateBrandFavourites,
  validateAddress,
  validateCategoriesLength,
  isValidated,
} = require('../middleware/validators');
const { upload } = require('../middleware/multer');

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post brand create
 * @method get get all brands
 * @method get get brand by id
 * @method put update brand
 * @method delete delete brand
 */

// Create -brand
router.post('/', checkAdminAuth, upload.single('image'), validateBrand, isValidated, brand.create);

// Read
router.get('/', brand.getAll); // Get all brands at once
router.post('/getTrendingBrands', validateAddress, isValidated, brand.trendingBrands); //Get Trending Brands
router.get('/getnewBrands', brand.getnewBrands); //Get Trending Brands
//Group
router.get('/groupbyCategory', brand.groupbyCategory); // Group Brands by categories
router.get('/groupAdsbySaleType', validateBrandFavourites, isValidated, brand.groupAdsbySaleType); // Group Brands by SaleType
router.get('/getBrandsByCategory', validateCategoriesLength, isValidated, brand.getBrandsByCategory); //Get Brands by categories
router.get('/relatedbrands/:categoryId', brand.relatedBrands); // Group Brands by SaleType
router.put('/:brandId', brand.getById); // Get one brand by it's id
//relatedbrands
// Update
router.put(
  '/:brandId',
  checkAdminAuth,
  upload.single('image'),
  // validateBrand,
  // isValidated,
  brand.update
);

// Delete
router.delete('/:brandId', checkAdminAuth, brand.delete); // delete a specific Sale by it's id

//get NearBy stores of a brand
router.post('/getStoresByBrand/:brandId', validateAddress, isValidated, brand.getStoresByBrand);

//Increase view of a brand
router.put('/increaseView/:brandId', brand.increaseView);
// Export
module.exports = router;
