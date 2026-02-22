const express = require("express");
const router = express.Router();
const oauth2Client = require("../config/googleAuth");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");

router.get("/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"
  ]
  });

  console.log("Generated URL:");
  console.log(url);

  res.redirect(url);
});

router.get("/google/callback", async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: "v2",
  });

  const { data } = await oauth2.userinfo.get();

  let user = await User.findOne({ email: data.email });

  if (!user) {
    user = await User.create({
      name: data.name,
      email: data.email,
      googleId: data.id,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.json({ token });
});

module.exports = router;
