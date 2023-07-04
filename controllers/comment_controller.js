const { body, validationResult } = require("express-validator");
const Comment = require("../models/comment");
const Post = require("../models/post");

exports.comment_create = [
  body("comment_content").isString().escape().trim().isLength({ min: 1 }),
  async (req, res, next) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      return res.status(400).json({ message: "Submitted wrong data." });
    }

    const comment = new Comment({
      comment_content: req.body.comment_content,
      timestamp: new Date(),
      author: req.user.id,
      post: req.params.id,
    });

    try {
      const comm = await comment.save();
      const post = await Post.findByIdAndUpdate(
        { _id: req.params.id },
        { $push: { comments: comment } }
      );
      res.json({ message: "Comment added successfully." });
    } catch (error) {
      res.json(error);
    }
  },
];
