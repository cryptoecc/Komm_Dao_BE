require("dotenv").config();

exports.OrigamiMembershipTokenProxyMetadata = async (req, res) => {
  try {
    const { tokenId } = req.params;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
