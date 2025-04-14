const express = require("express");
const {
  register,
  login,
  fblogin,
  fbcallback,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/fblogin", fblogin);
router.get("/facebook/callback", fbcallback);

module.exports = router;
