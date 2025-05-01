// routes/auth.routes.js
const express = require("express");
const {
  register,  // We will update this function in the controller
  login,
  fblogin,
  fbcallback,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);  // Handling the register (signup) request
router.post("/login", login);
router.get("/fblogin", fblogin);
router.get("/facebook/callback", fbcallback);

module.exports = router;
