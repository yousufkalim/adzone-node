/**
 * User auth routes
 * @author Shuja Naqvi
 */
const passport = require('passport');
const router = require('express').Router();
const auth = require('../controllers/auth');
const { checkAuth } = require('../middleware/checkAuth');
const {
  validateLogin,
  validateOtp,
  isValidated,
  changePasswordValidate
} = require('../middleware/validators');

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post user login
 * @method get check auth
 * @method put change password
 * @method post forgot email
 */

// Read
router.post('/login', validateLogin, isValidated, auth.login); // Get all users at once
router.get('/', checkAuth, auth.confirmAuth);
router.put('/password/:userId', changePasswordValidate, isValidated, auth.changePassword); // Change password route
router.put('/otp/:userId', validateOtp, isValidated, auth.verifyOtp); // Change password route
router.put('/forgot/:email', auth.forgot);
router.get(
  '/signup-google',
  passport.authenticate('signup-google', { scope: ['email', 'profile'] })
);
router.get('/login-google', passport.authenticate('login-google', { scope: ['email', 'profile'] }));
router.get(
  '/google-login-callback',
  passport.authenticate('login-google', { failureRedirect: auth.failure }),
  auth.returnGoogle
);
router.get(
  '/google-signup-callback',
  passport.authenticate('signup-google', { failureRedirect: auth.failure }),
  auth.createGoogle
);
// Export
module.exports = router;
