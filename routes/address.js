/**
 * Addressroutes
 * @author Shuja Naqvi
 */
const router = require('express').Router();

const address = require('../controllers/address');

router.get('/getAddress', address.address);
router.get('/getArea', address.getArea);
module.exports = router;
