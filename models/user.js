const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true, maxLength: 100 },
  passwd: { type: String, required: true, minLength: 8 },
});

module.exports = mongoose.model("User", UserSchema);
