const { ContributionInfo } = require("../../../../models/index");

// 모든 기여 정보 가져오기
exports.getAllContributions = async (req, res) => {
  try {
    const contributions = await ContributionInfo.findAll({
      where: {
        cont_status: "APPLIED", // APPLIED 상태 필터링
      },
    });
    res.status(200).json(contributions);
  } catch (error) {
    console.error("Error fetching contributions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
