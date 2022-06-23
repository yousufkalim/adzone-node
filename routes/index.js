/**
 * All api routes handles here
 * @author Yousuf Kalim
 */
const router = require("express").Router();

// Parent Routes
router.use("/admins", require("./admins")); // All the user routes
router.use("/users", require("./users")); // All the user routes
router.use("/auth", require("./auth")); // All the auth routes
router.use("/saletypes", require("./saletypes")); // All the sale type routes
router.use("/categories", require("./categories")); // All the categories routes
router.use("/brands", require("./brands")); // All the brands routes
router.use("/stores", require("./stores")); // All the Store routes
router.use("/ads", require("./ads")); // All the Store routes

// Export
module.exports = router;
