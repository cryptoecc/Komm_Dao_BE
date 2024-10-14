const express = require("express");
const router = express.Router();
const contributionInfo = require("./contribution.controller");

router.get("/get-contribution", contributionInfo.getAllContributions);
router.post("/send-invite-email", contributionInfo.sendInviteEmails);

module.exports = router;
