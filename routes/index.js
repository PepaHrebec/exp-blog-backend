const express = require("express");
const router = express.Router();

const post_controller = require("../controllers/post_controller");
const user_controller = require("../controllers/user_controller");
const comment_controller = require("../controllers/comment_controller");

const check = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: "Not authenticated" });
  }
};

router.get("/", (req, res, next) => {
  res.json({ name: "John", surname: "Kelly" });
});

router.get("/post", post_controller.posts_get);

router.post("/post", check, post_controller.post_create);

router.get("/post/:id", post_controller.post_get);

router.post("/post/:id/comment", check, comment_controller.comment_create);

/////////////////// user

router.get("/try", check, (req, res) => {
  return res.json("Hi");
});

router.get("/user", user_controller.users_get);

router.post("/user", user_controller.user_post);

router.get("/user/:id", user_controller.user_get);

router.post("/log-in", user_controller.user_log_in_post);

module.exports = router;
