/**
 * User CRUD controllers
 * @author Shuja Naqvi
 */
const Users = require('../models/User');
const Ads = require('../models/Ad');
const Brands = require('../models/Brand');
const Stores = require('../models/Store');
const Category = require('../models/Category');
const SaleType = require('../models/SaleType');
const bcrypt = require('bcryptjs');
const { findNearByStores } = require('../utils/findDistance');
const bcryptSalt = process.env.BCRYPT_SALT || 10;

/**
 * Create User - Signup
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    let { email, password } = req.body; // Getting required fields from body
    const existingUser = await Users.findOne({ email }); // Finding already existing user

    // Extra Validations
    if (existingUser) {
      // If we found existing user in db
      return res.status(409).json({ success: false, message: 'User already exists.' });
    }

    // Getting url of the image
    if (req.file) {
      req.body.photo = req.file.path; // Creating a new property called photo in body object
    }

    // Creating User
    req.body.password = bcrypt.hashSync(password, parseInt(bcryptSalt)); // Hashing the password with salt 8
    const user = await Users.create(req.body); // Adding user in db

    // Done
    res.json({ success: true, user }); //Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get all users
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const users = await Users.find(); // Finding all the users from db
    res.json({ success: true, users }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get user by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    const user = await Users.findById(userId)
      .populate('interest.categories')
      .populate('interest.brands')
      .populate('interest.sale_type')
      .populate('favourites.brands')
      .populate('favourites.ads'); // Finding user by id
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Update user
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    // Getting url of the image
    if (req.file) {
      req.body.photo = req.file.path; // Creating a new property called photo in body object
    }
    // If user want to update it's password

    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, parseInt(bcryptSalt));
    }

    const user = await Users.findByIdAndUpdate(userId, req.body, { new: true }); // Updating the user
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Add Address of  user
 * @param {object} req
 * @param {object} res
 */
exports.addAddress = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    const { address } = req.body;

    const user = await Users.findByIdAndUpdate(userId, { $push: { locations: address } }, { new: true }); // Updating the user
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Delete user
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    const user = await Users.findByIdAndDelete(userId); // Deleting the user
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Set Notification of user
 * @param {object} req
 * @param {object} res
 */
exports.updateNotificationSetting = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    const { notification } = req.body;
    const user = await Users.findByIdAndUpdate(userId, { notification_setting: notification }, { new: true }); // Setting notification
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Add Product  into  favourites  of user
 * @param {object} req
 * @param {object} res
 */
exports.AddtoFavourites = async (req, res) => {
  try {
    const { userId } = req.params; // Getting user id from URL parameter
    const { favid } = req.body;
    const ad = await Ads.findById(favid);
    if (ad) {
      const existingFav = await Users.findOne({
        _id: userId,
        'favourites.ads': favid,
      });
      if (existingFav) {
        return res.status(404).json({
          success: false,
          message: 'Already Added into Your Favourites',
        });
      }
      let user = await Users.findByIdAndUpdate(userId, { $push: { 'favourites.ads': favid } }, { new: true });
      const existingSale = await Users.findOne({
        _id: userId,
        'interest.sale_type': ad.sale_type,
      });
      if (!existingSale) {
        user.interest.sale_type.push(ad.sale_type);
        await user.save();
      }
      return res.json({ success: true, user }); // Success
    }
    const brand = await Brands.findById(favid);
    if (brand) {
      const existingFav = await Users.findOne({
        _id: userId,
        'favourites.brands': favid,
      });
      if (existingFav) {
        return res.status(404).json({
          success: false,
          message: 'Already Added into Your Favourites',
        });
      }
      const user = await Users.findByIdAndUpdate(userId, { $push: { 'favourites.brands': favid } }, { new: true });
      return res.json({ success: true, user }); // Success
    }
    return res.json({ success: false, message: 'Id not found' }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Remove Product  from  favourites  of user
 * @param {object} req
 * @param {object} res
 */
exports.RemoveFavourites = async (req, res) => {
  try {
    const { userId } = req.params; // Getting user id from URL parameter
    const { favid } = req.body;
    const ad = await Ads.findById(favid);
    if (ad) {
      const existingFav = await Users.findOne({
        _id: userId,
        'favourites.ads': favid,
      });
      if (!existingFav) {
        return res.status(404).json({
          success: false,
          message: 'Already Removed',
        });
      }
      const user = await Users.findByIdAndUpdate(userId, { $pull: { 'favourites.ads': favid } }, { new: true });
      const existingSale = await Users.findOne({
        _id: userId,
        'interest.sale_type': ad.sale_type,
      });
      if (existingSale) {
        const user = await Users.findByIdAndUpdate(userId, { $pull: { 'interest.sale_type': ad.sale_type } }, { new: true });
      }
      return res.json({ success: true, user }); // Success
    }
    const brand = await Brands.findById(favid);
    if (brand) {
      const existingFav = await Users.findOne({
        _id: userId,
        'favourites.brands': favid,
      });
      if (!existingFav) {
        return res.status(404).json({
          success: false,
          message: 'Already Removed',
        });
      }
      const user = await Users.findByIdAndUpdate(userId, { $pull: { 'favourites.brands': favid } }, { new: true });
      return res.json({ success: true, user }); // Success
    }
    res.json({ success: false, message: 'Id not found' }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Add Sale  into  Interest  of user
 * @param {object} req
 * @param {object} res
 */
exports.AddSaleInterest = async (req, res) => {
  try {
    const { userId } = req.params; // Getting user id from URL parameter
    const { sale } = req.body;

    const user = await Users.findByIdAndUpdate(userId, { $push: { 'interest.sale_type': sale } }, { new: true });
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Add Brand  into  Interest  of user
 * @param {object} req
 * @param {object} res
 */
exports.AddBrandInterest = async (req, res) => {
  try {
    const { userId } = req.params; // Getting user id from URL parameter
    const { brands } = req.body;
    const user = await Users.findByIdAndUpdate(userId, { $push: { 'interest.brands': brands } }, { new: true });
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Add Category  into  Interest  of user
 * @param {object} req
 * @param {object} res
 */
exports.AddCatgoryInterest = async (req, res) => {
  try {
    const { userId } = req.params; // Getting user id from URL parameter
    const { categories } = req.body;
    // const existingFav = await Users.findOne({
    //   _id: userId,
    //   'interest.categories': category,
    // });
    // if (existingFav) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Already Added into Your Inetrest',
    //   });
    // }
    // const user = await Users.findById(userId);
    // user.interest.categories.push(categories);
    // await user.save();
    const user = await Users.findByIdAndUpdate(userId, { $push: { 'interest.categories': categories } }, { new: true });
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling-
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Find user
 * @param {object} req
 * @param {object} res
 */
exports.FavouriteSale = async (req, res) => {
  try {
    const { user } = req.body; // Getting sale id from URL parameter
    const userInterest = await Users.findById(user);
    const ads = await Ads.find({
      sale_type: { $in: userInterest.interest.sale_type },
    }).populate({
      path: 'brand',
      populate: {
        path: 'stores',
      },
    });
    res.json({ success: true, ads: ads }); // Success
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
exports.nearByStores = async (req, res) => {
  try {
    let stores = await Stores.aggregate([
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
        $group: {
          _id: '$brand._id',
          storeData: {
            $push: '$$ROOT',
          },
        },
      },
    ]);
    const NearByStores = await findNearByStores(req.body.address.lat, req.body.address.lng, stores);
    const user = await Users.findByIdAndUpdate(req.body.userId, { nearby_stores: NearByStores }, { new: true });
    res.status(200).json({ success: true, user });
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
exports.getFavouriteBrands = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting sale id from URL parameter
    const user = await Users.findById(userId)
      .populate({
        path: 'nearby_stores',
        populate: {
          path: 'brand',
        },
      })
      .populate('nearby_stores.store');

    const favBrand = user.nearby_stores.filter((e) => user.favourites.brands.includes(e.brand._id));
    res.json({
      success: true,
      nearby_stores: favBrand,
    }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
/**
 * Search by Keyword
 * @param {object} req
 * @param {object} res
 */
exports.search = async (req, res) => {
  try {
    const { keyword } = req.body;
    let [categoriesIds, saleIds, brandIds] = [[], [], []];
    const categories = await Category.find({ name: { $regex: keyword, $options: '$i' } });
    const sales = await SaleType.find({ name: { $regex: keyword, $options: '$i' } });
    if (categories.length > 0) {
      categoriesIds = categories.map((e) => {
        return e._id;
      });
    }
    if (sales.length > 0) {
      sales.forEach((e) => {
        saleIds.push(e._id);
      });
    }
    const brands = await Brands.find({
      $or: [{ name: { $regex: keyword, $options: '$i' } }, { category: { $in: categoriesIds } }],
    }).populate('stores');
    if (brands.length > 0) {
      for (let i = 0; i < brands.length; i++) {
        brandIds.push(brands[i]._id);
      }
    }
    const ads = await Ads.find({
      $or: [
        { name: { $regex: keyword, $options: '$i' } },
        { category: { $in: categoriesIds } },
        { brand: { $in: brands } },
        { sale_type: { $in: saleIds } },
      ],
    })
      .populate({
        path: 'brand',
        populate: {
          path: 'stores',
        },
      })
      .populate('sale_type')
      .populate('category');
    res.json({ brands: brands, ads: ads });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
