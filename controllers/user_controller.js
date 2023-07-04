const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const bcrypt = require("bcryptjs");

exports.user_get = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.json(error);
  }
};

exports.users_get = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json({ users, user: req.user });
  } catch (error) {
    res.json(error);
  }
};
// edited for experimentation
// {"email":"josefhrebec@mail.com","passwd":"tajneHeslo"}

exports.user_log_in_post = [
  body("email").trim().escape().isLength({ min: 3, max: 100 }),
  body("passwd").trim().escape().isLength({ min: 3, max: 100 }),
  (req, res, next) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      res.json(errs);
    }
    passport.authenticate("local", {
      successRedirect: "/user",
    })(req, res, next);
  },
];

exports.user_post = [
  body("email").trim().isEmail().escape().isLength({ min: 6 }),
  body("passwd").trim().isString().escape().isLength({ min: 8 }),
  async (req, res, next) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      return res.status(400).json({ message: "Submitted wrong data." });
    }

    const { email, passwd } = req.body;
    const userLookup = await User.findOne({ email: email });

    if (userLookup) {
      return res.status(400).json({ message: "User already exists" });
    }
    try {
      const hashedPasswd = await bcrypt.hash(passwd, 10);
      const user = new User({
        email,
        passwd: hashedPasswd,
      });
      const userRes = await user.save();
      res.json(userRes);
    } catch (error) {
      res.json(error);
    }
  },
];
