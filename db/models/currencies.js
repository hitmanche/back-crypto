const mongoose = require("mongoose");

const currenciesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 10,
  },
  rate: {
    type: mongoose.Types.Decimal128,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("currencies", currenciesSchema);
