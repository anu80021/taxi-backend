const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phone: { type: String, unique: true },
  passwordHash: String
});

module.exports = mongoose.model("User", userSchema);
