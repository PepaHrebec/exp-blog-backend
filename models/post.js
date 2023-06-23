const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  post_name: { type: String, required: true, maxLength: 100 },
});

module.exports = mongoose.model("Category", PostSchema);
