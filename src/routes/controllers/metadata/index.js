const express = require("express");
const metadataController = require("./metadata.controller");
const router = express.Router();

router.get(
  "/metadata/token/:tokenId",
  metadataController.OrigamiMembershipTokenProxyMetadata
);
