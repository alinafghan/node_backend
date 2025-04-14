const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
  campaignId: {
    type: String,
    required: true,
  },

  industry: {
    type: String, //maybe a fixed enum?
    required: true,
  },
  platform: {
    type: String,
    enum: [
      "Facebook",
      "Instagram",
      "Twitter",
      "LinkedIn",
      "Google",
      "Snapchat",
      "TikTok",
      "Pinterest",
      "Reddit",
      "YouTube",
      "Other",
    ],
    required: true,
  },
  impressions: {
    type: Number,
    required: true,
  },
  clicks: {
    type: Number,
    required: true,
  },
  ctr: {
    type: Number,
    required: true,
  },
  cpa: {
    type: Number,
    required: true,
  },
  cpc: {
    type: Number,
    required: true,
  },
  conversion_rate: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Ad", adSchema);
