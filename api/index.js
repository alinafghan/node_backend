const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch"); // Import node-fetch to make HTTP requests
const cors = require("cors"); //middleware for working w angular frontend
const connectDB = require("../config/db.config");

//ROUTERS
const predictionRouter = require("../routes/BudgetModelRoute"); // Import the prediction route
const userRouter = require("../routes/UserRouter");
const trendsRoutes = require("../routes/TrendsModelRoute");
const authRouter = require("../routes/authRouter");
const adRouter = require("../routes/adsRouter");
const adImageRouter = require("../routes/adImageRouter"); // Add the new ad image router

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" })); // Increase payload limit for image data
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: `https://angular-app-kappa-red.vercel.app`,
    credentials: true, // Allow sending cookies (if needed)
  })
);
console.log("Its working");
//ROUTES
// /predict is the prediction router
app.use("/budget", predictionRouter); // Use the prediction route for /predict
app.use("/ads", adRouter);
app.use("/auth", authRouter);
app.use("/predict", predictionRouter);
app.use("/user", userRouter);
app.use("/predict", predictionRouter);
app.use("/trends", trendsRoutes);
app.use("/adImages", adImageRouter); // Add the new route for ad images

// Default route (optional)
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(4000, () => {
  console.log("Server started on port 3000");
});
