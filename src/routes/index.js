const express = require("express");
const router = express.Router();
const walletRouter = require("./controllers/wallet/index");
const userRouter = require("./controllers/user/index");

router.use("/api/user", userRouter);
router.use("/api/wallet", walletRouter);

module.exports = router;
