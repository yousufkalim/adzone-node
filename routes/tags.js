/**
 * tags CRUD routes
 * @author Shuja Naqvi
 */
const router = require('express').Router();
const tags = require('../controllers/tags');
const { checkAdminAuth } = require('../middleware/adminAuth');
const { validateTag, isValidated } = require('../middleware/validators');

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post tags create
 * @method get get all categorys
 * @method get get tags by id
 * @method put update tags
 * @method delete delete tags
 */

// Create -tags
router.post('/', checkAdminAuth, validateTag, isValidated, tags.create);

// Read
router.get('/', tags.getAll); // Get all categorys at once
router.get('/:tagId', tags.getById); // Get one tags by it's id

// Update
router.put('/:tagId', checkAdminAuth, validateTag, isValidated, tags.update);

// Delete
router.delete('/:tagId', checkAdminAuth, tags.delete); // delete a specific Sale by it's id

// Export
module.exports = router;
