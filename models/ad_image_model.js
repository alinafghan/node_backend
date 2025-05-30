const mongoose = require("mongoose");

const adImageSchema = new mongoose.Schema({
  campaignId: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  // If you're storing base64 image data directly
  imageData: {
    type: String,
  },
  impressions: {
    type: Number,
  },
  clicks: {
    type: Number,
  },
  conversions: {
    type: [Number], // e.g. [5, 10, 3] = 3 weeks of conversions
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("AdImage", adImageSchema);
