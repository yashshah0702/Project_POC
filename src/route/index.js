const express = require("express");
const router = express.Router();
// Import all route files
const messageRoutes = require("./message.route");
const activityRoutes = require("./activity.route");

// Define base paths for different route modules
router.use("/messages", messageRoutes);
router.use("/activities", activityRoutes);

module.exports = router;
