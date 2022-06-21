/**
 * Store schema
 * @author Shuja Naqvi
 */
const mongoose = require("mongoose");

// Schema
const StoreSchema = new mongoose.Schema(
  {
    name: String,
    picture: String,
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "brands" },
    location: {
      lat: Number,
      lng: Number,
      city: String,
      area: String,
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("stores", StoreSchema);
