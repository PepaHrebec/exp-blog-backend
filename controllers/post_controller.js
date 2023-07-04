const Post = require("../models/post");
const { body, validationResult } = require("express-validator");

exports.post_create = [
  body("post_name").isString().escape().trim().isLength({ min: 1, max: 100 }),
  body("post_content").isString().escape().trim().isLength({ min: 1 }),
  async (req, res, next) => {
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
    try {
      const postRes = await post.save();
      res.json(postRes);
    } catch (error) {
      res.json(error);
    }
  },
];

exports.posts_get = async (req, res, next) => {
  try {
    const postsRes = await Post.find({})
      .populate("author")
      .populate("comments");
    res.json(postsRes);
  } catch (error) {
    res.json(error);
  }
};

exports.post_get = async (req, res, next) => {
  try {
    const postRes = await Post.find({ id: req.params.id })
      .populate("author")
      .populate("comments");
    res.json(postRes);
  } catch (error) {
    res.json(error);
  }
};
