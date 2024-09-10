const express = require("express");
const router = express.Router();
const { getDeals, getDealById } = require("./deal.controller");

// Route to get all deals
router.get("/", getDeals);
router.get("/:dealId", getDealById);
// You can add more routes here as needed, such as POST, PUT, DELETEfor deals

module.exports = router;
