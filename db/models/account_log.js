const mongoose = require("mongoose");

const accountLogSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  type: {
    type: String,
    required: true,
  },
  old: {
    type: String,
    required: true,
    max: 10,
  },
  new: {
    type: String,
    required: true,
    max: 10,
  },
  value: {
    type: mongoose.Types.Decimal128,
    required: true,
    default: 0,
  },
  commission: {
    type: mongoose.Types.Decimal128,
    required: true,
    default: 0,
  },
  createDate: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("accountLog", accountLogSchema);
