/**
 * AdZone
 * @author Shuja Naqvi
 */
require("dotenv").config();
const app = require("express")();
const port = process.env.PORT || 5000;
const server = require("http").createServer(app);
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenSecret = process.env.JWT_SECRET;
const bcryptSalt = process.env.BCRYPT_SALT || 10;
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

require("./database");

// Middleware
require("./middleware/common")(app);

// API Routes
app.use("/api", require("./routes"));
// Server
server.listen(port, () => {
  console.log(`Server is running at port ${port} :)`);
});


//Notification
io.on("connection", (socket) => {
  try {
    console.log("Connected");
    exports.io = io;
    exports.socket = socket;
  } catch (error) {
    console.log(error.message);
  }
});


//Passport library to login user
const passport = require("passport"); 
 //As we are implementing google-login so add passport-google-oauth2 Strategy
const GoogleStrategy = require("passport-google-oauth2").Strategy;
//As we are implementing facebook-login so add passport-facebook Strategy
const FacebookStrategy = require("passport-facebook").Strategy;
//To manage sessions
const session = require("express-session");
//Dummy Model where will we will  find or create users
const User = require("./models/User");
//creating user's session
app.use(session({ secret: "melody hensley is my spirit animal" })); 
//initializing passport Strategy
app.use(passport.initialize());  
//using passport session 
app.use(passport.session());  



app.get("/api/auth/google",passport.authenticate("google", { scope: ["email", "profile"] }));

 passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
 const USER = await User.findById(id);
 done(null, USER);
});

    passport.use(new GoogleStrategy({
      clientID: process.env.GCP_CLIENT_ID,
      clientSecret: process.env.GCP_CLIENT_SECRET,
      callbackURL: process.env.BASE_URL+process.env.GOOGLE_CALLBACK,
      passReqToCallback : true
      },
      //After Successful login it will create or find  the user in db
      async (request, accessToken, refreshToken, profile, done) => {
        try {
        let existingUser = await User.findOne({ email: profile.emails[0].value });
        // if user exists return the user 
        if (existingUser) {
          existingUser.google_connected=true;
          await existingUser.save()
        return done(null, existingUser);
        }
        // if user does not exist create a new user 
        const newUser = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        google_connected:true,
        password: bcrypt.hashSync("12345678", parseInt(bcryptSalt)), // Hashing the password with salt 8
        });
        await newUser.save();
        return done(null, newUser);
        } catch (error) {
        return done(error, false)
        }
      }
  ));


 
   //Paste This Functionality in Index.js File
   app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/api/auth/google/failure", //If anything fails it will redirect to failure page
    }),
    async function (req, res) {
     try {
       const payload = {user:req.user} ;
    // Generating token
       jwt.sign(payload, tokenSecret, { expiresIn: 360000 }, (err, token) => {
               if (err) throw err;
               // done
               res.json({ success: true, user:req.user, token });
             });
      } catch (err) {
        // Error handling
        console.log('Error ----> ', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
    }
  );



  app.get("/api/auth/facebook",passport.authenticate("facebook", { scope: ["email"] }));


  passport.use(new FacebookStrategy({
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL:process.env.BASE_URL+ process.env.FB_CALLBACK,
    passReqToCallback : true,
     profileFields: ['id', 'emails', 'name']  //Fields required in response
    },
    //After Successful login it will create or find  the user in db
    async (request, accessToken, refreshToken, profile, done) => {
      try {
      let existingUser = await User.findOne({ email: profile.emails[0].value });
      // if user exists return the user 
      if (existingUser) {
        existingUser.facebook_connected=true;
        await existingUser.save();
      return done(null, existingUser);
      }
      // if user does not exist create a new user 
      const newUser = new User({
      name: profile.displayName,
      email: profile.emails[0].value,
      facebook_connected:true,
      password: bcrypt.hashSync("12345678", parseInt(bcryptSalt)), // Hashing the password with salt 8
      });
      await newUser.save();
      return done(null, newUser);
      } catch (error) {
      return done(error, false)
      }
    }
));


app.get(
  "/api/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/api/auth/facebook/failure", //If anything fails it will redirect to failure page
  }),
  async function (req, res) {
   try {
     const payload = {user:req.user} ;
  // Generating token
     jwt.sign(payload, tokenSecret, { expiresIn: 360000 }, (err, token) => {
             if (err) throw err;
             // done
             res.json({ success: true, user:req.user, token });
           });
    } catch (err) {
      // Error handling
      console.log('Error ----> ', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
);  