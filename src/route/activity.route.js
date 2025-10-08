const express = require("express");
const router = express.Router();
const verifyAzureToken = require("../middleware/verifyAzureToken");
const {loginActivity,logoutActivity} = require("../controller/activities.controller");

router.post("/login", verifyAzureToken,loginActivity );

router.post("/logout", verifyAzureToken, logoutActivity);

module.exports = router;