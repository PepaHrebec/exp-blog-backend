const express = require("express");
const app = express();
const indexRouter = require("./routes/index");
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");

const mongoDB = process.env.PASSWD;
mongoose.connect(mongoDB);

app.use(
  session({ secret: "supersecret", resave: false, saveUninitialized: false })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const initializePassport = require("./passport_config");
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

app.listen(3000, () => {
  console.log("Server listens at port 3000");
});

module.exports = app;
