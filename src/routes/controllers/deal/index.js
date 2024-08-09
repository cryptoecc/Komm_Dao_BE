const express = require("express");
const router = express.Router();
const { getDeals } = require("./deal.controller");

// Route to get all deals
router.get("/", getDeals);

// You can add more routes here as needed, such as POST, PUT, DELETE for deals

module.exports = router;
