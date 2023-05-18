const { google } = require('googleapis');
const { OAuth2 } = google.auth;
require('dotenv').config();

exports.oAuth2Client = new OAuth2(
  process.env.OAUTH2_CLIENT_ID,
  process.env.OAUTH2_CLIENT_SECRET,
  process.env.OAUTH2_REDIRECT_URI
);



