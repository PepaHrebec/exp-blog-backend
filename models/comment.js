const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  comment_content: { type: String, required: true },
  timestamp: { type: Date, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
});

module.exports = mongoose.model("Comment", CommentSchema);
