/**
 * Brand CRUD controllers
 * @author Shuja Naqvi
 *
 */
const Brands = require('../models/Brand');
const Ads = require('../models/Ad');
const Users = require('../models/User');
const SaleType = require('../models/SaleType');
const io = require('../index');
const Notifications = require('../models/Notification');
/**
 * Create brand
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    // Getting url of the image
    if (req.file) {
      req.body.picture = req.file.path; // Creating a new property called photo in body object
    }
    const brand = await Brands.findById(req.body.brand); // Finding brand by id
    if (!brand) {
      return res.json({ success: false, message: 'Brand not exist' }); //Not Found
    }
    const sale_type = await SaleType.findById(req.body.sale_type); // Finding brand by id
    if (!sale_type) {
      return res.json({ success: false, message: 'Invalid Sale Id' }); //Not Found
    }
    const users = await Users.find({
      $or: [
        {
          'notification_setting.brand': true,
          'notification_setting.sale': true,
        },
      ],
      $or: [{ 'interest.brands': brand }, { 'favourites.brands': brand }, { 'interest.sale_type': sale_type }],
    });
    if (users.length > 0) {
      await sendNotifications(users, brand, req.body.picture, sale_type.name);
    }
    const ad = await Ads.create(req.body); // Adding store in db
    brand.ads.push(ad._id);
    await brand.save();
    // Done
    res.json({ success: true, ad }); //Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get all ad
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const ad = await Ads.find()
      .populate('category')
      .populate('sale_type')
      .populate({
        path: 'brand',
        populate: {
          path: 'stores',
        },
      }); // Finding all the ad from db
    res.json({ success: true, ad }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get ad by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const adId = req.params.adId; // Getting ad id from URL parameter
    const ad = await Ads.findById(adId)
      .populate('category')
      .populate('sale_type')
      .populate({
        path: 'brand',
        populate: {
          path: 'stores',
        },
      }); // Finding ad by id
    res.json({ success: true, ad }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
/**
 * Get ad by id
 * @param {object} req
 * @param {object} res
 */
exports.getAdsbyBrands = async (req, res) => {
  try {
    const brands = req.body.brands;
    const ads = await Ads.find({ brand: { $in: brands } })
      .populate('sale_type')
      .populate('category')
      .populate({
        path: 'brand',
        populate: {
          path: 'stores',
        },
      });
    res.json({ success: true, ads }); // Success
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
exports.trendingAds = async (req, res) => {
  try {
    const ads = await Ads.find()
      .populate('category')
      .populate('sale_type')
      .populate({
        path: 'brand',
        populate: {
          path: 'stores',
        },
      })
      .sort({ views: -1 })
      .limit(8); // Finding ad by id
    res.json({ success: true, ads }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Update ad
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const adId = req.params.adId; // Getting ad id from URL parameter
    // Getting url of the image
    if (req.file) {
      req.body.picture = req.file.path; // Creating a new property called photo in body object
    }
    const ad = await Ads.findByIdAndUpdate(adId, req.body, {
      new: true,
    }); // Updating the ad
    res.json({ success: true, ad }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Increase ad's view
 * @param {object} req
 * @param {object} res
 */
exports.increaseView = async (req, res) => {
  try {
    const adId = req.params.adId; // Getting ad id from URL parameter
    const ad = await Ads.findById(adId);
    if (!ad) {
      return res.status(400).json({ success: false, message: 'Ad not found' });
    }

    ad.views = +ad.views + 1; //Increment in views
    await ad.save();
    res.json({ success: true, ad }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Delete Ads
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const adId = req.params.adId; // Getting ad id from URL parameter
    const ad = await Ads.findByIdAndDelete(adId); // Deleting the ad
    res.json({ success: true, ad }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
/**
 * Get ads by categoryId
 *      realtedBrands
 * @param {object} req
 * @param {object} res
 */
exports.relatedAds = async (req, res) => {
  try {
    const categoryId = req.params.categoryId; // Getting categoryId from URL parameter
    const brands = await Ads.find({ category: categoryId })
      .populate('category')
      .populate('sale_type')
      .populate({
        path: 'brand',
        populate: {
          path: 'stores',
        },
      }); // Finding brand by categoryId
    res.json({ success: true, brands }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
/**
 * Get Brand By Id
 * @param {object} req
 * @param {object} res
 */
exports.getAdsbySaleId = async (req, res) => {
  try {
    const saleId = req.body.sale; // Getting ad id from URL parameter
    const ads = await Ads.find({ sale_type: saleId })
      .populate('category')
      .populate('sale_type')
      .populate({
        path: 'brand',
        populate: {
          path: 'stores',
        },
      });
    // Finding ad by id
    res.json({ success: true, ads }); // Success
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
exports.groupbySaleType = async (req, res) => {
  try {
    let ads = await Ads.aggregate([
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
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: {
          path: '$categories',
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
//Function to send Notification
const sendNotifications = async (users, brand, AdImage, sale) => {
  for (i = 0; i < users.length; i++) {
    if (io.socket) {
      io.socket.emit(`${users[i]._id}adcreated`, {
        message: `${brand.name} is offering  ${sale}`,
      });
    }
    await Notifications.create({
      user: users[i]._id,
      title: `${brand.name} is offering  ${sale}`,
      description: `${brand.name} is offering  ${sale}`,
      brandImage: brand.picture,
      AdIamge: AdImage,
    });
  }
};

//calculate Distance

//Multiple Brand With Multiple stores

// const findBrandStore = async (latitude, longitude, ads) => {
//   try {
//     var R = 6371;
//     var Stores = [];
//     var tempStore = [];
//     lat2 = parseFloat(latitude);
//     lon2 = parseFloat(longitude);
//     for (var i = 0; i < ads.length; i++) {

//       for (var j = 0; j < ads.length; j++) {

//       }
//     }
//     // for (var h = 0; h < brands.length; h++) {
//     //   let brand = brands[h];
//     //   for (var i = 0; i < brand.stores.length; i++) {
//     //     var lat1 = brand.stores[i].location.lat;
//     //     var lon1 = brand.stores[i].location.lng;
//     //     var dLat = parseFloat(((lat2 - lat1) * Math.PI) / 180); // deg2rad below
//     //     var dLon = parseFloat(((lon2 - lon1) * Math.PI) / 180);
//     //     var a = parseFloat(
//     //       0.5 -
//     //         Math.cos(dLat) / 2 +
//     //         (Math.cos((lat1 * Math.PI) / 180) *
//     //           Math.cos((lat2 * Math.PI) / 180) *
//     //           (1 - Math.cos(dLon))) /
//     //           2
//     //     );
//     //     var distance = parseFloat(R * 2 * Math.asin(Math.sqrt(a)));
//     //     tempStore.push({
//     //       store: brand.stores[i],
//     //       brand: brand,
//     //       distance: distance,
//     //     });
//     //   }
//     //   console.log(tempStore, 'tempStore');
//     //   let max = tempStore.reduce(function (prev, current) {
//     //     return prev.distance <= current.distance ? prev : current;
//     //   }); //returns object
//     //   Stores.push(max);
//     //   max = '';
//     //   tempStore = [];
//     // }

//     return Stores;
//   } catch (err) {
//     console.log(err.message);
//   }
// };
