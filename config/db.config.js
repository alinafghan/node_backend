require("dotenv").config();
const mongoose = require("mongoose");

const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
  await mongoose
    .connect(mongoURI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));
};

module.exports = connectDB;
