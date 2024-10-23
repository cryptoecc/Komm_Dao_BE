const express = require("express");
const router = express.Router();
const contributionInfo = require("./contribution.controller");

router.get("/get-contribution", contributionInfo.getAllContributions);
router.post("/send-invite-email", contributionInfo.sendInviteEmails);
router.post("/check-duplicate-emails", contributionInfo.checkDuplicateEmails);
router.post("/check-applied-email", contributionInfo.getAppliedInviteCount);
router.post("/get-userXp", contributionInfo.getUserXpPoint);
router.post("/update-claimXp", contributionInfo.updateXpPoint);
router.post("/check-confirm", contributionInfo.checkUserConfirm);
router.post("/daily-check", contributionInfo.handleDailyCheck);
router.post("/daily-check-confirm", contributionInfo.dailyCheckConfirm);

module.exports = router;
