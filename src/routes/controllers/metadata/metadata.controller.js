const {
  getTokenMetadata,
} = require("../../../utils/membership-token-metadata");

require("dotenv").config();

exports.OrigamiMembershipTokenProxyMetadata = async (req, res) => {
  try {
    const { tokenId } = req.params;
    const metadata = await getTokenMetadata(tokenId);
    res.json(metadata);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
