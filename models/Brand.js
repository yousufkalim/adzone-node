/**
 * Brand schema
 * @author Shuja Naqvi
 */
const mongoose = require("mongoose");

// Schema
const brandsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    about: String,
    founded_on: String,
    annual_sale: String,
    picture: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "categories" },
    stores: [{ type: mongoose.Schema.Types.ObjectId, ref: "stores" }],
    ads: [{ type: mongoose.Schema.Types.ObjectId, ref: "ads" }],
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("brands", brandsSchema);
