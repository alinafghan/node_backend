const express = require("express");
const {
  add,
  getAdsfromCampaign,
  postCampaign,
  getAllCampaigns,
  getCampaign,
} = require("../controllers/campaign_controller");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/getCampaign/:campaignId", getCampaign);

router.post("/add", add);

router.post("/getAdsfromCampaign", getAdsfromCampaign);

router.get("/getAllCampaigns", authenticate, getAllCampaigns);

router.post("/postCampaign", authenticate, postCampaign);

module.exports = router;
