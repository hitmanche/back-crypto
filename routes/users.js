const router = require("express").Router();
const UserAccount = require("../db/models/user_account");

router.get("/account", async (req, res) => {
  const accountData = await UserAccount.find({ userEmail: req?.user.email });
  if (Array.isArray(accountData) && accountData.length > 0) {
    return res.send(accountData);
  }
  return res.status(400).send("An unknown error has occurred.");
});

module.exports = router;
