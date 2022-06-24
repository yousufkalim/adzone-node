/**
 * SaleType schema
 * @author Shuja Naqvi
 */
const mongoose = require("mongoose");

// Schema
const SaleTypeSchema = new mongoose.Schema(
  {
    name: String,
    views: Number,
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("sale_type", SaleTypeSchema);
