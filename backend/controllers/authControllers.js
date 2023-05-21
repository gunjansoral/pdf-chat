const jwt = require('jsonwebtoken');
const { oAuth2Client } = require('../config/OAuth2');
const User = require('../models/userModel');
const { google } = require('googleapis');
require('dotenv').config();

const { FRONTEND_URL } = process.env;


exports.authentication = (req, res) => {
  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ]
  });

  res.redirect(url);
};

exports.authenticationCallback = async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    const userInfo = await google.oauth2('v2').userinfo.get({ auth: oAuth2Client });
    const { email, name, picture } = userInfo.data;
    // Save user information to database if not already exists
    const check = await User.findOne({ email });
    if (check === null) {
      const user = new User({
        name,
        email,
        pic: picture
      })
      await user.save();
    }
    const token = jwt.sign({ email, name, picture }, 'secretKey', { expiresIn: '7d' });
    // Redirect to homepage or dashboard
    res.cookie('token', token, { maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res.redirect(`${FRONTEND_URL}/`)
  } catch (error) {
    console.error(error);
    res.redirect(`${FRONTEND_URL}/login`);
  }
}

exports.requireAuth = (req, res, next) => {
  try {
    const response = req.headers.authorization;
    const token = response?.slice(7)
    const decoded = jwt.verify(token, 'secretKey');
    req.name = decoded?.name;
    req.email = decoded?.email;
    req.picture = decoded?.picture;
    next();
  } catch (error) {
    console.log(error.message)
    return res.status(401).json({ message: 'Invalid token' });
  }
}