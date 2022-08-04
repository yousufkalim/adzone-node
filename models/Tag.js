/**
 * Tag schema
 * @author Shuja Naqvi
 */
const mongoose = require('mongoose');

// Schema
const TagSchema = new mongoose.Schema(
  {
    name: String,
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model('tags', TagSchema);
