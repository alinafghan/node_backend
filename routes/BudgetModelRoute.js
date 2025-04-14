const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

// Define the route to call the Python Flask API
router.get("/", async (req, res) => {
  const queryParams = req.query; // Access query parameters from the request
  console.log("Received query parameters:", queryParams);

  // test url
  // http://localhost:3000/predict?Target_Audience=5&Campaign_Goal=5&Duration=3&Channel_Used=4&Conversion_Rate=1.0&Acquisition_Cost=1.0&Location=1&Language=1&Clicks=80.0&Impressions=1.0&Engagement_Score=1&Customer_Segment=1&Scaled_ROI=1.0&Year=2023&Month=12&Day=25&ROI_log=1.0&Cost_Per_Click=1.0&Click_Through_Rate=53.0&Cost_Per_Impression=1.0&Engagement_Rate=1.0&Cost_Per_Engagement=1.0

  const inputData = [
    parseFloat(queryParams.Target_Audience) || 5,
    parseFloat(queryParams.Campaign_Goal) || 5,
    parseFloat(queryParams.Duration) || 3,
    parseFloat(queryParams.Channel_Used) || 4,
    parseFloat(queryParams.Conversion_Rate) || 1.0,
    parseFloat(queryParams.Acquisition_Cost) || 1.0,
    8,
    parseFloat(queryParams.Location) || 1,
    parseFloat(queryParams.Language) || 1,
    parseFloat(queryParams.Clicks) || 80.0,
    parseFloat(queryParams.Impressions) || 1.0,
    parseFloat(queryParams.Engagement_Score) || 1,
    parseFloat(queryParams.Customer_Segment) || 1,
    500,
    // parseFloat(queryParams.Scaled_ROI) || 1.0,
    // parseInt(queryParams.Year) || 2023,
    // parseInt(queryParams.Month) || 12,
    // parseInt(queryParams.Day) || 25,
    // parseFloat(queryParams.ROI_log) || 1.0,
    parseFloat(queryParams.Cost_Per_Click) || 1.0,
    parseFloat(queryParams.Click_Through_Rate) || 53.0,
    parseFloat(queryParams.Cost_Per_Impression) || 1.0,
    parseFloat(queryParams.Engagement_Rate) || 1.0,
    parseFloat(queryParams.Cost_Per_Engagement) || 48.0,
  ];

  console.log("Input data:", inputData);

  console.log("Calling Python REST API...");

  console.log("this the body sent", JSON.stringify({ input: inputData }));

  try {
    // Make the request to the Python REST API (Flask server)
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: inputData }),
    });

    const data = await response.json();

    if (data.prediction) {
      // res.send(`Prediction from Flask API: ${data.prediction}`);
      res.send(data.prediction);
    } else {
      console.log("Response from Flask API:", data);
      res.status(500).send("Error in getting prediction.");
    }
  } catch (error) {
    res.status(500).send("Error calling Python REST API: " + error.message);
  }
});

module.exports = router;
