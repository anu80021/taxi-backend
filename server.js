const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ DB error:", err));

// simple test route
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
app.use("/api/auth", require("./routes/auth"));

