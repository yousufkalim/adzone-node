/**
 * Ads schema
 * @author Shuja Naqvi
 *
 */
const mongoose = require('mongoose');

// Schema
const AdsSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    picture: String,
    sale_description: String,
    views: { type: Number, default: 0 },
    sale_date: { start_date: Date, end_date: Date },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'categories' },
    sale_type: { type: mongoose.Schema.Types.ObjectId, ref: 'sale_types' },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'brands' },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model('ads', AdsSchema);
