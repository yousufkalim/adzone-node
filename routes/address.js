/**
 * Addressroutes
 * @author Shuja Naqvi
 */
const router = require('express').Router();

const address = require('../controllers/address');

router.get('/getAddress', address.address);
module.exports = router;
