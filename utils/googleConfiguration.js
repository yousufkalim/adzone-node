const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('../models/User');
const GCP_CLIENT_ID = process.env.GCP_CLIENT_ID;
const GCP_CLIENT_SECRET = process.env.GCP_CLIENT_SECRET;
const GOOGLE_CALLBACK = process.env.GOOGLE_LOGIN_CALLBACK;
module.exports = passport => {
  passport.use(
    'login-google',
    new GoogleStrategy(
      {
        clientID: GCP_CLIENT_ID,
        clientSecret: GCP_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK,
        scope: ['profile'],
        state: true
      },
      function (accessToken, refreshToken, profile, cb) {
        return cb(null, profile);
      }
    )
  );
  passport.serializeUser(function (profile, done) {
    done(null, profile);
  });

  passport.deserializeUser(function (profile, done) {
    done(null, profile);
  });
};
