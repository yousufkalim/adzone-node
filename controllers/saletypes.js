/**
 * Sale Type CRUD controllers
 * @author Shuja Naqvi
 */
const SaleType = require('../models/SaleType');
const Users = require('../models/User');
const Ads = require('../models/Ad');

/**
 * Create Sale-Type
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    const sale = await SaleType.create(req.body); // Adding sale in db
    // Done
    res.json({ success: true, sale }); //Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get all Sales
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const sales = await SaleType.find(); // Finding all the sales from db
    res.json({ success: true, sales }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get sale by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const saleId = req.params.saleId; // Getting sale id from URL parameter
    const sale = await SaleType.findById(saleId); // Finding sale by id
    res.json({ success: true, sale }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Update Sale
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const saleId = req.params.saleId; // Getting sale id from URL parameter

    const sale = await SaleType.findByIdAndUpdate(saleId, req.body, {
      new: true,
    }); // Updating the sale
    res.json({ success: true, sale }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Delete sale type
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const saleId = req.params.saleId; // Getting sale id from URL parameter
    const sale = await SaleType.findByIdAndDelete(saleId); // Deleting the sale
    res.json({ success: true, sale }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get Favourite Sale
 * @param {object} req
 * @param {object} res
 */
exports.getFavouriteSale = async (req, res) => {
  try {
    const { userId } = req.params; // Getting sale id from URL parameter
    const userInterest = await Users.findById(userId);
    const ads = await Ads.find({
      sale_type: { $in: userInterest.interest.sale_type },
    })
      .populate({
        path: 'brand',
        populate: {
          path: 'stores',
        },
      })
      .populate('category')
      .populate('sale_type');
    // let favsale = [];
    // for (let i = 0; i < ads.length; i++) {
    //   for (let j = 0; j < userInterest.nearby_stores.length; j++) {
    //     if (ads[i].brand._id.equals(userInterest.nearby_stores[j].brand)) {
    //       favsale.push(ads[i], userInterest.nearby_stores[j].distance);
    //     }
    //   }
    // }
    res.json({
      success: true,
      favsale: ads,
    }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
