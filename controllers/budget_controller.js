const Ad = require("../models/ad_image_model");

const getPrice = async (req, res) => {
  try {
    const { totalBudget, campaignId } = req.body;

    if (!totalBudget) {
      return res.status(400).json({ error: "Total budget is required" });
    }
    if (!campaignId) {
      return res.status(400).json({ error: "Campaign ID is required" });
    }

    const adsData = await Ad.find({ campaignId });

    if (!adsData.length) {
      return res.status(404).json({ error: "No ad data found" });
    }

    // Define fallback industry weights (customize as needed)
    const industryWeights = {
      ecommerce: 1.5,
      education: 1.2,
      healthcare: 1.3,
      default: 1.0,
    };

    // Define platform weights (example)
    const platformWeights = {
      facebook: 1.4,
      instagram: 1.3,
      linkedin: 1.1,
      default: 1.0,
    };

    // Optional: seasonal multiplier, can be dynamic
    const seasonalMultiplier = 1;

    const adsWithScores = adsData.map((ad) => {
      const hasValidMetrics =
        ad.ctr > 0 && ad.cpa > 0 && ad.cpc > 0 && ad.conversion_rate > 0;

      let adjustedScore;

      if (hasValidMetrics) {
        const adScore =
          ad.ctr * 2 + 1 / ad.cpa + 1 / ad.cpc + ad.conversion_rate * 2;
        const platformWeight =
          platformWeights[ad.platform] || platformWeights.default;
        adjustedScore = adScore * platformWeight * seasonalMultiplier;
      } else {
        // Use fallback based on weights only
        const platformWeight =
          platformWeights[ad.platform] || platformWeights.default;
        const industryWeight =
          industryWeights[ad.industry] || industryWeights.default;
        adjustedScore = platformWeight * industryWeight * seasonalMultiplier;
      }

      return { ...ad._doc, adjustedScore };
    });

    const totalScore = adsWithScores.reduce(
      (sum, ad) => sum + ad.adjustedScore,
      0
    );

    const allocatedBudgets = adsWithScores.map((ad) => ({
      industry: ad.industry,
      platform: ad.platform,
      allocatedBudget: (ad.adjustedScore / totalScore) * totalBudget,
    }));

    res.status(200).json(allocatedBudgets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getPrice,
};
