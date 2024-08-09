const express = require("express");
const router = express.Router();
const walletRouter = require("./controllers/wallet/index");
const userRouter = require("./controllers/user/index");
const adminRouter = require("./controllers/admin/index");

router.use("/api/user", userRouter);
router.use("/api/wallet", walletRouter);
router.use("/api/admin", adminRouter);

module.exports = router;
