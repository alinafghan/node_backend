const express = require("express");
const {
  createCampaign,
  createAdSet,
  createAd,
  createAdCreative,
} = require("../controllers/FBAdController");

const router = express.Router();

router.post("/create_campaign", createCampaign);
router.post("/create_adset", createAdSet);
router.post("/create_ad", createAd);
router.post("/create_ad_creative", createAdCreative);

module.exports = router;
