/**
 * Category schema
 * @author Shuja Naqvi
 */
const mongoose = require("mongoose");

// Schema
const CategorySchema = new mongoose.Schema(
  {
    name: String,
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("categories", CategorySchema);
