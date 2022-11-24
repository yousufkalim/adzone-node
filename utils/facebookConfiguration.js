const FacebookStrategy = require('passport-facebook').Strategy;
const FB_CLIENT_ID = process.env.FB_CLIENT_ID;
const FB_CLIENT_SECRET = process.env.FB_CLIENT_SECRET;
const FB_CALLBACK = process.env.FACEBOOK_LOGIN_CALLBACK;
module.exports = passport => {
  passport.use(
    'login-facebook',
    new FacebookStrategy(
      {
        clientID: FB_CLIENT_ID,
        clientSecret: FB_CLIENT_SECRET,
        callbackURL: FB_CALLBACK,
        profileFields: ['id', 'emails', 'name'] //Fields required in response
      },
      async (accessToken, refreshToken, profile, cb) => {
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
