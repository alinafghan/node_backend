const AdImage = require("../models/ad_image_model");
const Campaign = require("../models/campaign_model");
const axios = require("axios");

// Add a new ad image to a campaign
const addAdImage = async (req, res) => {
  try {
    const { campaignId, prompt, width, height, imageData } = req.body;

    if (!campaignId || !prompt || !width || !height || !imageData) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if campaign exists
    const campaign = await Campaign.findOne({ campaignId });
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    // Create a new ad image
    const newAdImage = new AdImage({
      campaignId,
      prompt,
      width,
      height,
      imageUrl: `${campaignId}_${Date.now()}`, // You might want to generate a better URL
      imageData, // base64 encoded image data
    });

    const savedAdImage = await newAdImage.save();

    res.status(201).json({
      message: "Ad image added successfully",
      adImage: {
        id: savedAdImage._id,
        campaignId: savedAdImage.campaignId,
        prompt: savedAdImage.prompt,
        width: savedAdImage.width,
        height: savedAdImage.height,
        imageUrl: savedAdImage.imageUrl,
        createdAt: savedAdImage.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Generate an ad image using the Flask API
const generateAdImage = async (req, res) => {
  try {
    const { campaignId, prompt, width, height } = req.body;

    if (!campaignId || !prompt) {
      return res
        .status(400)
        .json({ error: "Campaign ID and prompt are required" });
    }

    // Check if campaign exists
    const campaign = await Campaign.findOne({ campaignId });
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    // Call the Flask API to generate the image
    const response = await axios.post("http://localhost:5000/flux", {
      prompt,
      width: width || 576,
      height: height || 1024,
      randomize_seed: true,
      num_inference_steps: 4,
    });

    if (!response.data || !response.data["Generated Image"]) {
      return res.status(500).json({ error: "Failed to generate image" });
    }

    // Create a new ad image with the generated image data
    const newAdImage = new AdImage({
      campaignId,
      prompt,
      width: width || 576,
      height: height || 1024,
      imageUrl: `${campaignId}_${Date.now()}`,
      imageData: response.data["Generated Image"], // base64 encoded image
    });

    const savedAdImage = await newAdImage.save();

    res.status(201).json({
      message: "Ad image generated and added successfully",
      adImage: {
        id: savedAdImage._id,
        campaignId: savedAdImage.campaignId,
        prompt: savedAdImage.prompt,
        width: savedAdImage.width,
        height: savedAdImage.height,
        imageUrl: savedAdImage.imageUrl,
        createdAt: savedAdImage.createdAt,
        imageData: savedAdImage.imageData,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all ad images for a campaign
const getAdImagesForCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;

    if (!campaignId) {
      return res.status(400).json({ error: "Campaign ID is required" });
    }

    const adImages = await AdImage.find({ campaignId });

    if (!adImages.length) {
      return res
        .status(404)
        .json({ error: "No ad images found for this campaign" });
    }

    // Format the response to exclude sensitive or large data if needed
    const formattedAdImages = adImages.map((img) => ({
      id: img._id,
      campaignId: img.campaignId,
      prompt: img.prompt,
      width: img.width,
      height: img.height,
      imageUrl: img.imageUrl,
      createdAt: img.createdAt,
    }));

    res.status(200).json(formattedAdImages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a specific ad image by ID
const getAdImageById = async (req, res) => {
  try {
    const { imageId } = req.params;

    if (!imageId) {
      return res.status(400).json({ error: "Image ID is required" });
    }

    const adImage = await AdImage.findById(imageId);

    if (!adImage) {
      return res.status(404).json({ error: "Ad image not found" });
    }

    res.status(200).json({
      id: adImage._id,
      campaignId: adImage.campaignId,
      prompt: adImage.prompt,
      width: adImage.width,
      height: adImage.height,
      imageUrl: adImage.imageUrl,
      imageData: adImage.imageData, // Include image data in response
      createdAt: adImage.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete an ad image
const deleteAdImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    if (!imageId) {
      return res.status(400).json({ error: "Image ID is required" });
    }

    const deletedImage = await AdImage.findByIdAndDelete(imageId);

    if (!deletedImage) {
      return res.status(404).json({ error: "Ad image not found" });
    }

    res.status(200).json({ message: "Ad image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateAdWithCaption = async (req, res) => {
  try {
    const { id, caption } = req.body;

    if (!id || !caption) {
      return res.status(400).json({ error: "Ad ID and caption are required." });
    }

    const updatedAd = await AdImage.findByIdAndUpdate(
      id,
      { caption },
      { new: true }
    );

    if (!updatedAd) {
      return res.status(404).json({ error: "Ad not found." });
    }

    res.status(200).json({
      message: "Caption updated successfully.",
      updatedAd,
    });
  } catch (error) {
    console.error("Error updating caption:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addAdImage,
  generateAdImage,
  updateAdWithCaption,
  getAdImagesForCampaign,
  getAdImageById,
  deleteAdImage,
};
