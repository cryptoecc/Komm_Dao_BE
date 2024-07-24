const express = require("express");
const walletController = require("./wallet.controller");

const router = express.Router();

router.post("/verify-address", walletController.verify);
router.post("/check-wallet", walletController.checkWallet);

module.exports = router;
