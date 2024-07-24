const express = require("express");
const router = express.Router();
const walletRouter = require("./controllers/wallet/index");

router.use("/api/wallet", walletRouter);

module.exports = router;
