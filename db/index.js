var mongoose = require("mongoose");
const Currencies = require("./models/currencies");

module.exports = () => {
  mongoose.connect(process.env.DATABASE_CONNECT);

  mongoose.connection.on("open", async () => {
    const currencies = await Currencies.findOne({});

    if (!currencies) {
      const currency_data = [
        { name: "ETH", rate: 0.04791411 },
        { name: "LTC", rate: 0.00592855 },
        { name: "DASH", rate: 0.06756612 },
        { name: "XRP", rate: 0.00002001 },
      ];
      await Currencies.insertMany(currency_data);
    }
    console.log("MongoDB: Connected");
  });
  mongoose.connection.on("error", (err) => {
    console.log("MongoDB: Error", err);
  });

  mongoose.Promise = global.Promise;
};
