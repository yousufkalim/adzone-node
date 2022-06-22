/**
 * Sale CRUD routes
 * @author Shuja Naqvi
 */
const router = require("express").Router();
const sale = require("../controllers/saletypes");
const { checkAdminAuth } = require("../middleware/adminAuth");
const { validateSale, isValidated } = require("../middleware/validators");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post sale signup
 * @method get get all sales
 * @method get get sale by id
 * @method put update sale
 * @method delete delete sale
 */

// Create -Sale
router.post("/", checkAdminAuth, validateSale, isValidated, sale.create);

// Read
router.get("/", sale.getAll); // Get all sales at once
router.get("/:saleId", sale.getById); // Get one sale by it's id

// Update
router.put("/:saleId", checkAdminAuth, validateSale, isValidated, sale.update);

// Delete
router.delete("/:saleId", checkAdminAuth, sale.delete); // delete a specific Sale by it's id

// Export
module.exports = router;
