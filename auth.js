const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// ✅ Define User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  phone:     { type: String, required: true, unique: true },
  password:  { type: String, required: true }
});
const User = mongoose.model("User", userSchema);

const JWT_SECRET = "supersecret"; // ⚠️ move to .env in real project

// ✅ Register
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, phone, password } = req.body;

    if (!firstName || !lastName || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ firstName, lastName, phone, password: hashedPassword });
    await newUser.save();

    // ✅ generate token
    const token = jwt.sign({ id: newUser._id, phone: newUser.phone }, JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({
      message: "Registration successful",
      token,
      user: { firstName: newUser.firstName, lastName: newUser.lastName, phone: newUser.phone }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Login
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ message: "Invalid phone or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid phone or password" });

    // ✅ generate token
    const token = jwt.sign({ id: user._id, phone: user.phone }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "Login successful",
      token,
      user: { firstName: user.firstName, lastName: user.lastName, phone: user.phone }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
