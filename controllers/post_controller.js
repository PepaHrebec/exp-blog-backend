const Post = require("../models/post");
const { body, validationResult } = require("express-validator");

exports.post_create = [
  body("post_name").isString().escape().trim().isLength({ min: 1, max: 100 }),
  body("post_content").isString().escape().trim().isLength({ min: 1 }),
  (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ message: "Submitted wrong data." });
    }
    const post = new Post({
      post_name: req.body.post_name,
      post_content: req.body.post_content,
      timestamp: new Date(),
      author: req.user.id,
      comments: [],
    });
    post
      .save()
      .then((post) => res.json(post))
      .catch((err) => res.json(err));
  },
];

exports.posts_get = (req, res, next) => {
  Post.find({})
    .populate("author")
    .then((results) => {
      res.json(results);
    })
    .catch((err) => res.json(err));
};

exports.post_get = () => {};
