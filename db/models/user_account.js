const mongoose = require("mongoose");

const userAccountScheme = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    currency: {
      type: String,
      required: true,
      max: 10,
    },
    value: {
      type: mongoose.Types.Decimal128,
      required: true,
      default: 0,
    },
  },
  { typePojoToMixed: false }
);

module.exports = mongoose.model("userAccount", userAccountScheme);
