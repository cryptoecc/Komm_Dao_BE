const express = require("express");
const router = express.Router();
const contributionInfo = require("./contribution.controller");

router.get("/get-contribution", contributionInfo.getAllContributions);

module.exports = router;
