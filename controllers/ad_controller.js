const Ad = require("../models/ad_image_model");
const Campaign = require("../models/campaign_model");

const add = async (req, res) => {
  try {
    const {
      campaignId,
      industry,
      platform,
      cpc,
      ctr,
      impressions,
      clicks,
      cpa,
      conversion_rate,
    } = req.body;

    if (
      !campaignId ||
      !platform ||
      ctr == null ||
      cpa == null ||
      cpc == null ||
      conversion_rate == null
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newAd = new Ad({
      campaignId,
      industry,
      platform,
      cpc,
      ctr,
      impressions,
      clicks,
      cpa,
      conversion_rate,
    });

    const ad = await newAd.save();

    res.status(201).json({ message: "Ad added successfully", ad: newAd });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "internal server error" });
  }
};

const postCampaign = async (req, res) => {
  try {
    const {
      campaignId,
      campaignName,
      industry,
      platform,
      duration,
      businessId,
    } = req.body;

    if (!campaignId || !businessId) {
      return res
        .status(400)
        .json({ error: "Campaign ID and Business ID are required" });
    }

    const newCampaign = new Campaign({
      campaignId,
      campaignName,
      industry,
      platform,
      duration,
      businessId,
    });

    const campaign = await newCampaign.save();

    res
      .status(201)
      .json({ message: "Campaign successfully added", campaign: newCampaign });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "itnernal server error" });
  }
};

const getCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;

    if (!campaignId) {
      return res.status(400).json({ error: "Campaign ID is required" });
    }

    const campaign = await Campaign.findOne({ campaignId });

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    res.status(200).json({ campaign });
  } catch (error) {
    console.error("Error fetching campaign:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({});

    if (campaigns.length === 0) {
      res.status(400).json({ error: "No campaigns found" });
    }
    res.status(200).json(campaigns);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "internal server error" });
  }
};

const getAdsfromCampaign = async (req, res) => {
  try {
    const campaignId = req.body.campaignId;

    if (!campaignId) {
      return res.status(400).json({ error: "Campaign ID is required" });
    }

    const adsData = await Ad.find({ campaignId });

    if (!adsData.length) {
      return res
        .status(400)
        .json({ error: "No ad data found for the given campaign ID" });
    }

    res.status(200).json(adsData);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "internal server error" });
  }
};

module.exports = {
  add,
  getAdsfromCampaign,
  postCampaign,
  getAllCampaigns,
  getCampaign,
};
