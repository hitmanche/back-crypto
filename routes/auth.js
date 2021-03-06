const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../db/models/user");
const UserAccount = require("../db/models/user_account");

const Joi = require("@hapi/joi");

const registrationScheme = Joi.object({
  fullName: Joi.string().min(6).required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

const loginScheme = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

router.post("/register", async (req, res) => {
  const { error } = registrationScheme.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  } else {
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
      return res.status(400).send("This e-mail address is used.");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.password, salt);

      const user_account = [
        { userEmail: req.body.email, currency: "ETH", value: 0 },
        { userEmail: req.body.email, currency: "LTC", value: 0 },
        { userEmail: req.body.email, currency: "DASH", value: 0 },
        { userEmail: req.body.email, currency: "XRP", value: 4000 },
      ];

      try {
        await UserAccount.insertMany(user_account);
        await new User({
          fullName: req.body.fullName,
          email: req.body.email,
          password: hashPassword,
          balance: 0,
        }).save();
        return res.json("User created.");
      } catch {
        return res
          .status(400)
          .send("An error occurred while creating the user.");
      }
    }
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const { error } = loginScheme.validate(req.body);
  if (!user) {
    return res.status(400).send("You entered an incorrect email or password.");
  } else if (!(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(400).send("You entered an incorrect email or password.");
  } else if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const expires = Number(process.env.TOKEN_EXPIRES);
  const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, {
    expiresIn: expires,
  });

  const userAccount = await UserAccount.find({ userEmail: req.body.email });

  return res.json({ expires, token, user, userAccount });
});

module.exports = router;
