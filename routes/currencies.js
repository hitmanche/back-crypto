const router = require("express").Router();
const Currencies = require("../db/models/currencies");

router.get("/", async (req, res) => {
  const currenciesData = await Currencies.find({});
  if (Array.isArray(currenciesData) && currenciesData.length > 0) {
    res.send(currenciesData);
  }
  res.status(400).send('An unknown error has occurred.');
});

module.exports = router;
