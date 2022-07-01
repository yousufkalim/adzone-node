/**
 * Notification schema
 * @author Shuja Naqvi
 */
const mongoose = require("mongoose");

// Schema
const notificationSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    brandImage: String,
    AdImage: String,
    seen: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("notifications", notificationSchema);
