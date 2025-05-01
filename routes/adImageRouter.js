const express = require("express");
const {
  addAdImage,
  generateAdImage,
  getAdImagesForCampaign,
  getAdImageById,
  deleteAdImage,
  updateAdWithCaption,
  addConversions,
} = require("../controllers/ad_image_controller");

const router = express.Router();

// Add a new ad image with provided image data
router.post("/add", addAdImage);

// Generate and add a new ad image
router.post("/generate", generateAdImage);

// Get all ad images for a campaign
router.get("/campaign/:campaignId", getAdImagesForCampaign);

// Get a specific ad image
router.get("/:imageId", getAdImageById);

// Delete an ad image
router.delete("/:imageId", deleteAdImage);

router.put("/update_caption", updateAdWithCaption);

router.put("/add_conversions", addConversions);
module.exports = router;
