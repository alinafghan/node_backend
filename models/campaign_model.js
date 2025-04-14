const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  campaignId: {
    type: String,
    required: true,
  },
  campaignName: {
    type: String,
    required: true,
  },
  duration: {
    //in months? or string from here til here
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  businessId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Campaign", campaignSchema);
