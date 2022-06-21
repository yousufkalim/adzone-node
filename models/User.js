/**
 * User schema
 * @author Shuja Naqvi
 */
const mongoose = require("mongoose");

// Schema
const userSchema = new mongoose.Schema(
  {
    name: String,
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
    locations: [
      {
        lat: Number,
        lng: Number,
        city: String,
        area: String,
      },
    ],
    current_location: {
      lat: Number,
      lng: Number,
      city: String,
      area: String,
    },
    favourites: [
      {
        brand: [{ type: mongoose.Schema.Types.ObjectId, ref: "brands" }],
        ads: [{ type: mongoose.Schema.Types.ObjectId, ref: "ads" }],
      },
    ],
    interest: [
      {
        brand: [{ type: mongoose.Schema.Types.ObjectId, ref: "brands" }],
        ads: [{ type: mongoose.Schema.Types.ObjectId, ref: "ads" }],
        sale_type: [
          { type: mongoose.Schema.Types.ObjectId, ref: "sale_types" },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("users", userSchema);
