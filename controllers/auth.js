/**
 * User auth controllers
 * @author Shuja Naqvi
 */
const Users = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/sendEmail');
const bcryptSalt = process.env.BCRYPT_SALT || 10;
const tokenSecret = process.env.JWT_SECRET;

/**
 * Login
 * @param {object} req
 * @param {object} res
 */
exports.login = async (req, res) => {
  try {
    // Getting email and password
    const { email, password } = req.body;

    // Getting user from db
    const user = await Users.findOne({ email });

    if (!user) {
      // If user not found
      console.log(user);
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Comparing password
    const isMatched = bcrypt.compareSync(password, user.password);

    if (!isMatched) {
      // If password not matched
      return res.status(400).json({ success: false, message: 'Invalid Password' });
    }

    // Creating payload with user object
    const payload = { user };

    // Generating token
    jwt.sign(payload, tokenSecret, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;

      // done
      res.json({ success: true, user, token });
    });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Change Password
 * @param {object} req
 * @param {object} res
 */
exports.changePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirm password are not same'
      });
    }

    let user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatched = bcrypt.compareSync(oldPassword, user.password);

    if (!isMatched) {
      return res.status(400).json({ success: false, message: 'Invalid old Password' });
    }

    // Generate token
    user.password = bcrypt.hashSync(newPassword, parseInt(bcryptSalt));

    await user.save();

    res.json({ success: true, user });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Forgot password
 * @param {object} req
 * @param {object} res
 */
exports.forgot = async (req, res) => {
  try {
    let { email } = req.params;
    let user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Generating otp
    let otp = (Math.random() + 1).toString(36).substring(6);

    // Sending email to user
    sendEmail(email, otp)
      .then(async () => {
        // If email is sent then we have to update the password in db
        user.otp = otp;
        user.is_verified = false;
        await user.save();
        // Done
        res.json({ success: true, message: 'Email sent successfully', user });
      })
      .catch(err => {
        // Error handling
        console.log('Error ----> ', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
      });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

//validateOtp
exports.verifyOtp = async (req, res) => {
  try {
    let { userId } = req.params;
    let { otp } = req.body; // Getting required fields from body
    let user = await Users.findById(userId); //find otp by id
    //if otp is invalid
    if (user.otp != otp) {
      return res.status(404).json({ success: false, message: 'OTP is invalid' });
    }
    res.json({
      success: true,
      message: 'OTP verified'
    });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Confirm auth
 * @param {object} req
 * @param {object} res
 */
exports.confirmAuth = async (req, res) => {
  // If user authenticated
  res.json({ success: true, user: req.user });
};

/**
 * Failure
 * @param {object} req
 * @param {object} res
 */
exports.failure = async (req, res) => {
  return res.redirect(process.env.CLIENT_URL);
};

exports.returnGoogle = async (req, res) => {
  try {
    const email = req.user.emails[0].value;
    const user = await Users.findOne({ email: email, google_connected: true });
    if (user) {
      const payload = { user };

      // Generating token
      jwt.sign(payload, tokenSecret, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;

        return res.redirect(
          process.env.CLIENT_URL + `?LoginByGoogle=true&&token=${token}&&message=user-found`
        );
      });
    } else {
      return res.redirect(
        process.env.CLIENT_URL + `?LoginByGoogle=false&&message=user-not-found&&token=null`
      );
    }
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.createGoogle = async (req, res) => {
  try {
    const profile = req.user;
    const email = req.user.emails[0].value;
    const user = await Users.findOne({ email: email });
    if (user) {
      return res.redirect(
        process.env.CLIENT_URL + `?SignupByGoogle=false&&message=user-already-exists&&token=null`
      );
    } else {
      let newUser = await Users.create({
        google_connected: true,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: email
      });
      // Generating token
      const payload = { newUser };
      jwt.sign(payload, tokenSecret, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        return res.redirect(
          process.env.CLIENT_URL + `?SignupByGoogle=true&&message=user-created&&token=${token}`
        );
      });
    }
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.returnFacebook = async (req, res) => {
  try {
    const email = req.user.emails[0].value;
    const user = await Users.findOne({ email: email, google_connected: true });
    if (user) {
      const payload = { user };

      // Generating token
      jwt.sign(payload, tokenSecret, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;

        return res.redirect(
          process.env.CLIENT_URL + `?LoginFacebook=true&&token=${token}&&message=user-found`
        );
      });
    } else {
      return res.redirect(
        process.env.CLIENT_URL + `?LoginByFacebook=false&&message=user-not-found&&token=null`
      );
    }
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.createFacebook = async (req, res) => {
  try {
    const profile = req.user;
    const email = req.user.emails[0].value;
    const user = await Users.findOne({ email: email });
    if (user) {
      return res.redirect(
        process.env.CLIENT_URL + `?SignupByFacebook=false&&message=user-already-exists&&token=null`
      );
    } else {
      let newUser = await Users.create({
        facebook_connected: true,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: email
      });
      // Generating token
      const payload = { newUser };
      jwt.sign(payload, tokenSecret, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        return res.redirect(
          process.env.CLIENT_URL + `?SignupByFacebook=true&&message=user-created&&token=${token}`
        );
      });
    }
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
