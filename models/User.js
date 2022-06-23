/**
 * User schema
 * @author Shuja Naqvi
 */
const mongoose = require("mongoose");

// Schema
const userSchema = new mongoose.Schema(
  {
    name: String,
    photo: String,
    otp: String,
    phone_number: String,
    is_verified: Boolean,
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    facebook_connected: {
      type: Boolean,
      default: false,
    },
    google_connected: {
      type: Boolean,
      default: false,
    },
    current_location: {
      lat: Number,
      lng: Number,
      city: String,
      area: String,
    },
    notification_setting: {
      phone: { type: Boolean, default: false },
      email: { type: Boolean, default: true },
      brand: { type: Boolean, default: true },
      sale: { type: Boolean, default: true },
    },
    locations: [
      {
        lat: Number,
        lng: Number,
        city: String,
        area: String,
      },
    ],
    favourites: {
      brands: [{ type: mongoose.Schema.Types.ObjectId, ref: "brands" }],
      ads: [{ type: mongoose.Schema.Types.ObjectId, ref: "ads" }],
    },
    interest: {
      brands: [{ type: mongoose.Schema.Types.ObjectId, ref: "brands" }],
      categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "categories" }],
      sale_type: [{ type: mongoose.Schema.Types.ObjectId, ref: "sale_type" }],
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("users", userSchema);
