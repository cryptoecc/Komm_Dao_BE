const express = require("express");
const router = express.Router();
const walletRouter = require("./controllers/wallet/index");
const userRouter = require("./controllers/user/index");
const adminRouter = require("./controllers/admin/index");
const metadataRouter = require("./controllers/metadata/index");

router.use("/api/user", userRouter);
router.use("/api/wallet", walletRouter);
router.use("/api/admin", adminRouter);
router.use("/api/metadata", metadataRouter);

module.exports = router;
