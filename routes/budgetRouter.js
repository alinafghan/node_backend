const express = require("express");
const { getPrice } = require("../controllers/budget_controller");

const router = express.Router();

router.post("/getBudget", getPrice);

module.exports = router;
