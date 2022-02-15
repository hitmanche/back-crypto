const mongoose = require("mongoose");

const userScheme = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  balance: {
    type: mongoose.Types.Decimal128,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("user", userScheme);
