require("dotenv").config();
const {
  ContributionInfo,
  ContributionMissions,
  sequelize,
} = require("../../../../../models/index");

exports.contributionList = async (req, res) => {
  try {
    const contributions = await ContributionInfo.findAll(); // CONTRIBUTION_INFO 테이블의 모든 데이터를 가져옴
    res.json(contributions); // 데이터를 JSON 형식으로 반환
  } catch (error) {
    console.error("Error fetching contributions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.cerateContribution = async (req, res) => {
  const {
    pjt_id,
    pjt_name,
    cont_type,
    cont_category,
    max_participant,
    cont_desc,
    start_date,
    end_date,
    cont_xp,
    missions, // 미션 정보는 배열로 받아옴
  } = req.body;
  console.log(missions);

  let parsedMissions = missions;

  if (typeof missions === "string") {
    try {
      parsedMissions = JSON.parse(missions);
    } catch (error) {
      return res.status(400).json({
        error: "Invalid missions format. Must be a valid JSON array.",
      });
    }
  }

  // 트랜잭션을 사용하여 데이터 일관성 보장
  const t = await sequelize.transaction();
  try {
    console.log("asd");
    const profileImageLink = req.files.profileImage
      ? `uploads/contribution/${req.files.profileImage[0].filename}`
      : `uploads/contribution/logo_default.png`;

    const bannerImageLink = req.files.bannerImage
      ? `uploads/contribution/${req.files.bannerImage[0].filename}`
      : `uploads/contribution/banner_default.png`;

    // 1. 기여 정보를 CONTRIBUTION_INFO에 저장
    const contribution = await ContributionInfo.create(
      {
        pjt_id,
        pjt_name,
        cont_type,
        cont_category,
        max_participant,
        cont_logo: profileImageLink,
        cont_banner: bannerImageLink,
        cont_desc,
        start_date,
        end_date,
        cont_xp,
        cont_status: "PENDING", // 기본값으로 설정
      },
      { transaction: t }
    );

    const cont_id = contribution.cont_id; // 새로 생성된 기여의 ID 가져오기

    // 2. 미션 정보를 CONTRIBUTION_MISSIONS에 저장
    if (parsedMissions.length > 0) {
      const missionRecords = parsedMissions.map((mission) => ({
        cont_id,
        ms_type: mission.missionType,
        ms_yn: "N",
      }));

      await ContributionMissions.bulkCreate(missionRecords, { transaction: t });
    }

    // 트랜잭션 커밋
    await t.commit();

    res.status(200).json({
      message: "Contribution and missions saved successfully",
      contribution,
    });
  } catch (error) {
    // 트랜잭션 롤백
    await t.rollback();
    res.status(500).json({
      error: "Failed to save contribution and missions",
      details: error.message,
    });
  }
};
