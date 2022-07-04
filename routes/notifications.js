/**
 * Notification routes
 * @author Shuja Naqvi
 */
const router = require("express").Router();
const notifications = require("../controllers/notifications");
const { checkAuth } = require("../middleware/checkAuth");
/**
 * ////////////////////////// Routes /////////////////////////
 * @method post create Notification
 * @method get get all Notification
 * @method get get Notification by id
 * @method delete delete notifications
 */

// Read
router.get("/getByUser/:userId", checkAuth, notifications.getByUser); // Get all notifications of servants
router.get("/:notificationId", checkAuth, notifications.getById); // Get one notification by it's id
// Delete
router.delete("/:notificationId", checkAuth, notifications.delete); // delete a specific quote by it's id
//update
router.put("/seenByUser/:userId", checkAuth, notifications.seenByUser);

// Export
module.exports = router;
