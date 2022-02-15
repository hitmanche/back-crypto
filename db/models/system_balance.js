const mongoose = require("mongoose");

const systemBalanceSchema = new mongoose.Schema({
  balance: {
    type: mongoose.Types.Decimal128,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("systemBalance", systemBalanceSchema);
