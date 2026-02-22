// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  googleId: String,
  accessToken: String,
  refreshToken: String,
  monthlySavings: [
  {
    month: String,
    amount: Number,
  }
],
  savingsTotal: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);