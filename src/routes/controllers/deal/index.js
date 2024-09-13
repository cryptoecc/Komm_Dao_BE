const express = require("express");
const router = express.Router();
const {
  getDeals,
  getDealById,
  updateUserInterest,
} = require("./deal.controller");

// Route to get all deals
router.get("/", getDeals);
router.get("/:dealId", getDealById);
router.put("/:dealId/user/:userId/interest", updateUserInterest);

module.exports = router;
