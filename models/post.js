const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  post_name: { type: String, required: true, maxLength: 100 },
  post_content: { type: String, required: true },
  timestamp: { type: Date, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

module.exports = mongoose.model("Post", PostSchema);
