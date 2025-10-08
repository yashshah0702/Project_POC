const express = require("express");
const router = express.Router();
const verifyAzureToken = require("../middleware/verifyAzureToken");
const {createMessage} = require("../controller/message.controller");

router.post('/add-message', verifyAzureToken,createMessage);

module.exports = router;