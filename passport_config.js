const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");

function init(passport) {
  const authenticateUser = async (username, password, done) => {
    try {
      const user = await User.findOne({ email: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.passwd, (err, res) => {
        if (err) {
          return done(err);
        } else if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password" });
        }
      });
      // if (password === user.passwd) {
      //   return done(null, user);
      // } else {
      //   return done(err);
      // }
    } catch (err) {
      return done(err);
    }
  };
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "passwd",
      },
      authenticateUser
    )
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async function (id, done) {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}

/// při autentikaci v user_controlleru se zavolá authenticateUser
/// user vrácenej z toho se pošle do serialize, kde se id uloží do req.user
/// při dalším přístupu k req.user se zavolá deserialize

module.exports = init;
