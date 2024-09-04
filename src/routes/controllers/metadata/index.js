const express = require("express");
const metadataController = require("./metadata.controller");
const router = express.Router();

router.get("/:tokenId", metadataController.OrigamiMembershipTokenProxyMetadata);

module.exports = router;
