const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const bcrypt = require("bcryptjs");

exports.user_get = (req, res, next) => {
  User.findById(req.params.id).then((usr) => {
    res.json(usr);
  });
};

exports.users_get = (req, res, next) => {
  User.find({}).then((result) => res.json({ result, user: req.user }));
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
      successRedirect: "/users",
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
    } else {
      bcrypt.hash(passwd, 10, (err, result) => {
        if (err) {
          return res.status(400).json({ message: "Error hasing password" });
        } else {
          const user = new User({
            email,
            passwd: result,
          });

          user
            .save()
            .then(() => {
              return res.json(user);
            })
            .catch((err) => next(err));
        }
      });
    }
  },
];
