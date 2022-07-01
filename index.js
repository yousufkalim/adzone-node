/**
 * AdZone
 * @author Shuja Naqvi
 */
require("dotenv").config();
const app = require("express")();
const port = process.env.PORT || 5000;
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
// const passport = require("passport");
// const FacebookStrategy = require("passport-facebook").Strategy;
// const GoogleStrategy = require("passport-google-oauth2").Strategy;
// const session = require("express-session");
// const User = require("./models/Users");
require("./database");

// Middleware
require("./middleware/common")(app);

// API Routes
app.use("/api", require("./routes"));
//session secret
// app.use(session({ secret: "melody hensley is my spirit animal" }));
// Server
server.listen(port, () => {
  console.log(`Server is running at port ${port} :)`);
});

// app.use(passport.initialize());
// app.use(passport.session());

// app.get("/api/auth/facebook", passport.authenticate("facebook"));

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FB_Client_ID,
//       clientSecret: process.env.FB_Client_Secret,
//       callbackURL: process.env.FACEBOOK_CALLBACK,
//     },
//     async function (accessToken, refreshToken, profile, cb) {
//       await User.findOne({ email: profile.email }, function (err, user) {
//         return cb(err, user);
//       });
//     }
//   )
// );

// app.get(
//   "/api/auth/facebook/callback",
//   passport.authenticate("facebook", { failureRedirect: "/login" }),
//   async function (req, res) {
//     // Successful authentication, redirect home.
//     const email = req.user.email;
//     const user = await User.findOne({ email: email });
//     if (user) {
//       const payload = { user };
//       // Generating token
//       jwt.sign(payload, tokenSecret, { expiresIn: 360000 }, (err, token) => {
//         if (err) throw err;

//         // done
//         res.json({ success: true, user, token });
//       });
//     } else {
//       let newUser = await User.create({
//         email: email,
//       });
//       jwt.sign(payload, tokenSecret, { expiresIn: 360000 }, (err, token) => {
//         if (err) throw err;
//         // done
//         res.json({ success: true, newUser, token });
//       });
//     }
//   }
// );

// app.get(
//   "/api/auth/google",
//   passport.authenticate("google", { scope: ["email", "profile"] })
// );
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GCP_CLIENT_ID,
//       clientSecret: process.env.GCP_CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_CALLBACK,
//       passReqToCallback: true,
//     },
//     async function (request, accessToken, refreshToken, profile, done) {
//       await User.findOne({ email: profile.email }, function (err, user) {
//         return done(err, user);
//       });
//     }
//   )
// );

// app.get(
//   "/api/auth/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "/api/auth/google/failure",
//   }),
//   async function (req, res) {
//     // Successful authentication, redirect home.
//     const email = req.user.email;
//     const user = await User.findOne({ email: email });
//     if (user) {
//       const payload = { user };
//       // Generating token
//       jwt.sign(payload, tokenSecret, { expiresIn: 360000 }, (err, token) => {
//         if (err) throw err;

//         // done
//         res.json({ success: true, user, token });
//       });
//     } else {
//       let newUser = await User.create({
//         email: email,
//       });
//       jwt.sign(payload, tokenSecret, { expiresIn: 360000 }, (err, token) => {
//         if (err) throw err;
//         // done
//         res.json({ success: true, newUser, token });
//       });
//     }
//   }
// );

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
