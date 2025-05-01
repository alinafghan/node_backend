// const Ad = require("../models/ad_image_model"); // Adjust the path as necessary
// const axios = require("axios");

// const getPrice = async (req, res) => {
//   try {
//     const { totalBudget, campaignId } = req.body;

//     if (!totalBudget) {
//       return res.status(400).json({ error: "Total budget is required" });
//     }
//     if (!campaignId) {
//       return res.status(400).json({ error: "Campaign ID is required" });
//     }

//     const adsData = await Ad.find({ campaignId });

//     if (!adsData.length) {
//       return res.status(404).json({ error: "No ad data found" });
//     }

//     // Define fallback industry weights (customize as needed)
//     const industryWeights = {
//       ecommerce: 1.5,
//       education: 1.2,
//       healthcare: 1.3,
//       default: 1.0,
//     };

//     // Define platform weights (example)
//     const platformWeights = {
//       facebook: 1.4,
//       instagram: 1.3,
//       linkedin: 1.1,
//       default: 1.0,
//     };

//     // Optional: seasonal multiplier, can be dynamic
//     const seasonalMultiplier = 1;

//     const adsWithScores = adsData.map((ad) => {
//       const hasValidMetrics =
//         ad.ctr > 0 && ad.cpa > 0 && ad.cpc > 0 && ad.conversion_rate > 0;

//       let adjustedScore;

//       if (hasValidMetrics) {
//         const adScore =
//           ad.ctr * 2 + 1 / ad.cpa + 1 / ad.cpc + ad.conversion_rate * 2;
//         const platformWeight =
//           platformWeights[ad.platform] || platformWeights.default;
//         adjustedScore = adScore * platformWeight * seasonalMultiplier;
//       } else {
//         // Use fallback based on weights only
//         const platformWeight =
//           platformWeights[ad.platform] || platformWeights.default;
//         const industryWeight =
//           industryWeights[ad.industry] || industryWeights.default;
//         adjustedScore = platformWeight * industryWeight * seasonalMultiplier;
//       }

//       return { ...ad._doc, adjustedScore };
//     });

//     const totalScore = adsWithScores.reduce(
//       (sum, ad) => sum + ad.adjustedScore,
//       0
//     );

//     const allocatedBudgets = adsWithScores.map((ad) => ({
//       industry: ad.industry,
//       platform: ad.platform,
//       allocatedBudget: (ad.adjustedScore / totalScore) * totalBudget,
//     }));

//     res.status(200).json(allocatedBudgets);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// const getBudget = async (req, res) => {
//   try {
//     const { totalBudget, campaignId } = req.body;

//     if (!totalBudget) {
//       return res.status(400).json({ error: "Total budget is required" });
//     }
//     if (!campaignId) {
//       return res.status(400).json({ error: "Campaign ID is required" });
//     }

//     // Fetch your ads & their conversion histories from Mongo
//     const adsData = await Ad.find({ campaignId });
//     if (!adsData.length) {
//       return res.status(404).json({ error: "No ad data found" });
//     }

//     // Build the conversions array: one sub‐array per ad
//     // e.g. adsData = [{ conversions: [12, 15] }, { conversions: [5] }, …]
//     const conversions = adsData.map((ad) => ad.conversions || []);

//     console.log("Conversions: ", conversions);
//     // Check if the conversions array is empty

//     const response = await axios.post("http://127.0.0.1:5000/allocate", {
//       n_ads: adsData.length,
//       budget: totalBudget,
//       conversions,
//     });

//     // Forward the Python allocation result to the client
//     return res.json(response.data);
//   } catch (error) {
//     console.error("Error in getBudget:", error.response?.data || error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

const axios = require("axios");
const Ad = require("../models/ad_image_model"); // Adjust the path as necessary

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

    // Call the Python optimization endpoint to get the x_opt (budgets)
    const response = await axios.post("http://127.0.0.1:5000/allocate", {
      n_ads: adsData.length,
      budget: totalBudget,
      conversions: adsData.map((ad) => ad.conversions), // Assuming conversions are available in the Ad model
    });

    // Extract x_opt from Python response
    const x_opt = response.data.x_opt;

    if (!x_opt || x_opt.length !== adsData.length) {
      return res
        .status(500)
        .json({ error: "Invalid response from Python optimization" });
    }

    // Return the optimal budgets (x_opt) in the same format
    const allocatedBudgets = adsData.map((ad, index) => ({
      adId: ad._id, // Assuming ad has an '_id' field
      adCaption: ad.caption, // Assuming ad has a 'caption' field
      adImageData: ad.imageData, // Assuming ad has an 'imageData' field
      industry: ad.industry, // Assuming ad has an 'industry' field
      platform: ad.platform, // Assuming ad has a 'platform' field
      allocatedBudget: x_opt[index], // Use the corresponding x_opt value
    }));

    res.status(200).json(allocatedBudgets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getPrice };
