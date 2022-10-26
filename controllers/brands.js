/**
 * Brand CRUD controllers
 * @author Shuja Naqvi
 *
 */
const Brands = require('../models/Brand');
const Ads = require('../models/Ad');
const mongoose = require('mongoose');
const { findStores, findBrandStore, findMybrandStores } = require('../utils/findDistance');
/**
 * Create brand
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    // Getting url of the image
    
    if (!req.file) {
    res.status(404).json({ success: false, message: 'Brand Picture Required' });
    }
    req.body.picture = req.file.path; // Creating a new property called photo in body object
    const brand = await Brands.create(req.body); // Adding brand in db
    // Done
    res.json({ success: true, brand }); //Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get all brands
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const brands = await Brands.find().populate('stores').sort({ views: -1 }); // Finding all the brands from db
    res.json({ success: true, brands }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get brand by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const brandId = req.params.brandId; // Getting brand id from URL parameter
    const brand = await Brands.findById(brandId).populate('stores'); // Finding brand by id
    //if user send location
    if (req?.body?.location?.lat && req?.body?.location?.lng && brand.stores.length > 1) {
      const NearByStore = await findMybrandStores(req.body.location.lat, req.body.location.lng, brand.stores);
      console.log(NearByStore, 'NearByStore');
      return res.json({ success: true, brand, nearByStore: NearByStore }); // Success
    }
    res.json({ success: true, brand }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get brand by categoryId
 *      realtedBrands
 * @param {object} req
 * @param {object} res
 */
exports.relatedBrands = async (req, res) => {
  try {
    const categoryId = req.params.categoryId; // Getting categoryId from URL parameter
    const brands = await Brands.find({ category: categoryId }).populate('stores').populate('category'); // Finding brand by categoryId
    res.json({ success: true, brands }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**  Get getStoresByBrand
 * @param {object} req
 * @param {object} res
 */
exports.getStoresByBrand = async (req, res) => {
  try {
    const brandId = req.params.brandId; // Getting brand id from URL parameter
    const brand = await Brands.findById(brandId).populate('stores').populate('category'); // Finding brand by id
    const stores = await findStores(req.body.address.lat, req.body.address.lng, brand.stores);
    res.json({ success: true, stores }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**  Get getStoresByBrand
 * @param {object} req
 * @param {object} res
 */
exports.getnewBrands = async (req, res) => {
  try {
    const brands = await Brands.find().populate('stores').populate('category').sort({ createdAt: -1 }); // Finding brand by id
    if (req?.body?.address) {
      const stores = await findBrandStore(req.body.address.lat, req.body.address.lng, brands);
      return res.json({ success: true, brands: stores }); // Success
    }
    res.json({ success: true, brands }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**  Get getBrandsfrom array of categories
 * @param {object} req
 * @param {object} res
 */
exports.getBrandsByCategory = async (req, res) => {
  try {
    const categories = req.body.categories;
    const brands = await Brands.find({ category: { $in: categories } })
      .populate('stores')
      .populate('category');
    res.json({ success: true, brands }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Update brand
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const brandId = req.params.brandId; // Getting brand id from URL parameter
    // Getting url of the image
    if (req.file) {
      req.body.picture = req.file.path; // Creating a new property called photo in body object
    }
    const brand = await Brands.findByIdAndUpdate(brandId, req.body, {
      new: true,
    }); // Updating the brand
    res.json({ success: true, brand }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Increase brand's view
 * @param {object} req
 * @param {object} res
 */
exports.increaseView = async (req, res) => {
  try {
    const brandId = req.params.brandId; // Getting brand id from URL parameter
    const brand = await Brands.findById(brandId);
    if (!brand) {
      return res.status(400).json({ success: false, message: 'Brand Not Found ...:(' });
    }
    brand.views = +brand.views + 1; //Increment in views
    await brand.save();
    res.json({ success: true, brand }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get Treanding Ads
 * @param {object} req
 * @param {object} res
 */
exports.trendingBrands = async (req, res) => {
  try {
    const brand = await Brands.find().populate('category').populate('stores').sort({ views: -1 }).limit(8); // Finding ad by id

    const stores = await findBrandStore(req.body.address.lat, req.body.address.lng, brand);
    res.json({ success: true, stores }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Delete Brand
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const brandId = req.params.brandId; // Getting brand id from URL parameter
    const brand = await Brands.findByIdAndDelete(brandId); // Deleting the brand
    res.json({ success: true, brand }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get All Brands Group on the basis of category
 * @param {object} req
 * @param {object} res
 */
exports.groupbyCategory = async (req, res) => {
  try {
    let brands = await Brands.aggregate([
      {
        $lookup: {
          from: 'stores',
          localField: 'stores',
          foreignField: '_id',
          as: 'stores',
        },
      },
      {
        $unwind: {
          path: '$stores',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$category.name',
          data: {
            $push: '$$ROOT',
          },
        },
      },
    ]);
    res.status(200).json({ success: true, brands });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get All Brands Group on the basis of category
 * @param {object} req
 * @param {object} res
 */
exports.groupAdsbySaleType = async (req, res) => {
  try {
    const brandId = mongoose.Types.ObjectId(req.body.brand);
    let ads = await Ads.aggregate([
      {
        $match: { brand: brandId },
      },
      {
        $lookup: {
          from: 'brands',
          localField: 'brand',
          foreignField: '_id',
          as: 'brand',
        },
      },
      {
        $unwind: {
          path: '$brand',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'sale_types',
          localField: 'sale_type',
          foreignField: '_id',
          as: 'sale_type',
        },
      },
      {
        $unwind: {
          path: '$sale_types',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'stores',
          localField: 'brand.stores',
          foreignField: '_id',
          as: 'brand.stores',
        },
      },
      {
        $group: {
          _id: '$sale_type.name',
          data: {
            $push: '$$ROOT',
          },
        },
      },
    ]);
    res.status(200).json({ success: true, ads });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
