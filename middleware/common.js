/**
 * Common middleware that we have to use by default every time
 * @author Yousuf Kalim
 */
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');

// Common Middleware
module.exports = app => {
  app.use(cors({ origin: true })); // CORS (Cross Origin Policy) to restrict unknown requests
  app.use(logger('dev')); // Morgan - to log every request in console
  app.use(express.urlencoded({ extended: true })); // to get url encoded data from requests
  app.use(express.json()); // to send json data in response (It's mandatory in rest api's)
  app.use('/uploads', express.static('uploads', { maxAge: '31536000' })); // Static path to serve uploaded images with cache policy
  app.use(passport.initialize());
  app.use(passport.session());
  //Google Configure
  require('../utils/googleConfiguration')(passport);
  //Google Configure
  require('../utils/signupGoogleConfiguration')(passport);
  //FaceBook
  require('../utils/facebookConfiguration')(passport);
  require('../utils/signupFacebookConfiguration')(passport);
};
