const router = require("express").Router();
const Joi = require("@hapi/joi");
const UserAccount = require("../db/models/user_account");
const Currencies = require("../db/models/currencies");
const AccountLog = require("../db/models/account_log");

const actionCurrency = Joi.object({
  oldCurrency: Joi.string().required(),
  newCurrency: Joi.string().required(),
  value: Joi.number().required(),
  type: Joi.string().required(),
});

router.post("/", async (req, res) => {
  const { error } = actionCurrency.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  if (!req?.user)
    return res.status(400).send("User information could not be found.");

  const accountData = await UserAccount.find({ userEmail: req.user.email });

  let oldAccount = accountData.find((x) => x.currency === req.body.oldCurrency);
  let newAccount = accountData.find((x) => x.currency === req.body.newCurrency);

  const currencies = await Currencies.find({});
  let commission = 0;
  let notCommission = 0;

  var oldValue = parseFloat(oldAccount.value.toString());
  var newValue = parseFloat(newAccount.value.toString());

  const ncRate = parseFloat(
    currencies.find((x) => x.name === req.body.newCurrency).rate.toString()
  );
  const ocRate = parseFloat(
    currencies.find((x) => x.name === req.body.oldCurrency).rate.toString()
  );

  if (req.body.type === "B") {
    notCommission = (ocRate * req.body.value) / ncRate;
    commission = (notCommission * 45) / 10000;
    oldAccount.value = oldValue + (req.body.value * 9955) / 10000;
    newAccount.value = newValue - notCommission;

    if (newValue < notCommission) {
      return res
        .status(400)
        .send(
          `You don't have that many ${req.body.newCurrency} assets to buy.`
        );
    }
  }
  if (req.body.type === "S") {
    if (oldValue < req.body.value) {
      return res
        .status(400)
        .send(
          `You don't have that many ${req.body.oldCurrency} assets to sell.`
        );
    }

    oldAccount.value = oldValue - req.body.value;
    notCommission = (ocRate * req.body.value) / ncRate;
    commission = (notCommission * 45) / 10000;
    newAccount.value = newValue + (notCommission * 9955) / 10000;
  }

  await UserAccount.updateOne({ _id: oldAccount._id }, oldAccount);
  await UserAccount.updateOne({ _id: newAccount._id }, newAccount);

  await new AccountLog({
    email: req.user.email,
    type: req.body.type,
    old: req.body.oldCurrency,
    new: req.body.newCurrency,
    value: (notCommission * 955) / 1000,
    commission: commission,
  }).save();

  res.json({});
});

module.exports = router;
