//
const Notifications = require("../models/Notification");
const cron = require("node-cron");
/**
 * Get all Notifications of user
 * @param {object} req
 * @param {object} res
 */
exports.getByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId);
    const notifications = await Notifications.find({
      user: userId,
      seen: false,
    });
    if (!notifications) return res.status(404).json("notifications  not found");
    return res.status(202).json({ success: true, notifications });
  } catch (err) {
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * See Notification
 * @param {object} req
 * @param {object} res
 */
exports.seenByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    await Notifications.updateMany(
      { user: userId, seen: false },
      { seen: true }
    );
    return res
      .status(202)
      .json({ success: true, message: "Seen Successfully" });
  } catch (err) {
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get notification by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    const notification = await Notifications.findById(notificationId).populate(
      "user"
    );
    if (!notification) return res.status(404).send("notification not found");
    else return res.status(202).json({ success: true, notification });
  } catch (err) {
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
/**
 * Delete Notification
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    const deletedNotification = await Notifications.findByIdAndDelete(
      notificationId
    );
    if (!deletedNotification) return res.status(404).json("Already Deleted");
    else return res.status(202).json({ success: true, deletedNotification });
  } catch (err) {
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//cron-job that will run after every 10days to delete all expired notifications from DB
cron.schedule("0 0 23 * *", async () => {
  let sevenDaysCount = new Date().getTime() - 604800000; //seven days before
  let sevenDays = new Date(sevenDaysCount); //Set date
  sevenDays = moment(sevenDays).format("YYYY-MM-DD");
  sevenDays = new Date(sevenDays);
  await Notifications.deleteMany({
    createdAt: { $lt: sevenDays },
    seen: true,
  });
});
