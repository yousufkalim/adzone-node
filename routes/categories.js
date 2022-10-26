/**
 * category CRUD routes
 * @author Shuja Naqvi
 */
const router = require('express').Router();
const category = require('../controllers/categories');
const { checkAdminAuth } = require('../middleware/adminAuth');
const {upload }=require("../middleware/multer")
const { validateCategory, isValidated } = require('../middleware/validators');

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post category create
 * @method get get all categorys
 * @method get get category by id
 * @method put update category
 * @method delete delete category
 */

// Create -category
router.post('/' ,checkAdminAuth,upload.single("image"), validateCategory, isValidated, category.create);

// Read
router.get('/', category.getAll); // Get all categorys at once
router.get('/:categoryId', category.getById); // Get one category by it's id

// Update
router.put('/:categoryId' ,checkAdminAuth,upload.single("image"), validateCategory, isValidated, category.update);

// Delete
router.delete('/:categoryId', checkAdminAuth, category.delete); // delete a specific Sale by it's id

// Export
module.exports = router;
