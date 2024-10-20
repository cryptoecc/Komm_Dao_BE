const express = require("express");
const router = express.Router();
const walletRouter = require("./controllers/wallet/index");
const userRouter = require("./controllers/user/index");
const dealRouter = require("./controllers/deal/index");
const contributionRouter = require("./controllers/contribution/index");
const adminRouter = require("./controllers/admin/index");
const metadataRouter = require("./controllers/metadata/index");
const projectRouter = require("./controllers/project/index");

router.use("/api/user", userRouter);
router.use("/api/project", projectRouter);
router.use("/api/wallet", walletRouter);
router.use("/api/deals", dealRouter);
router.use("/api/contribution", contributionRouter);
router.use("/api/admin", adminRouter);
router.use("/api/metadata", metadataRouter);

module.exports = router;
