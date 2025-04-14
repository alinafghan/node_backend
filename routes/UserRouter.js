const express = require("express");
const User = require("../models/user_model"); // Adjust the path if needed

const router = express.Router();

// Route to add a new user
router.post("/addUser", async (req, res) => {
  try {
    const { username, id, email } = req.body;

    // Check if all required fields are provided
    if (!username || !id || !email) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create a new user
    const newUser = new User({ username, id, email, createdAt: new Date() });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to add user", details: error.message });
  }
});

module.exports = router;
