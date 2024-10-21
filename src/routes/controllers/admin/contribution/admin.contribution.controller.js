require("dotenv").config();
const {
  ContributionInfo,
  ContributionMissions,
  sequelize,
  UserInviteContribution,
  UserInfo,
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
    console.log(cont_id);

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

// 백엔드 컨트롤러 예시 (adminContribution.controller.js)
exports.updateContributionStatus = async (req, res) => {
  const { cont_id, cont_status } = req.body;

  try {
    // `cont_id`에 해당하는 CONTRIBUTION_INFO의 상태 업데이트
    const result = await ContributionInfo.update(
      { cont_status },
      {
        where: { cont_id },
      }
    );

    if (result[0] > 0) {
      res
        .status(200)
        .json({ message: "Contribution status updated successfully" });
    } else {
      res.status(404).json({ message: "Contribution not found" });
    }
  } catch (error) {
    console.error("Error updating contribution status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getInviteDetail = async (req, res) => {
  const { cont_id } = req.params; // cont_id를 파라미터로 받음

  try {
    // cont_id에 해당하는 모든 초대 정보를 가져옴
    const inviteData = await UserInviteContribution.findAll({
      where: { cont_id }, // cont_id 기준으로 검색
      include: [
        {
          model: UserInfo,
          as: "user", // 초대자의 정보를 포함
          attributes: ["user_id", "user_name", "wallet_addr"], // 초대자의 정보 포함
        },
      ],
    });

    if (!inviteData.length) {
      return res
        .status(404)
        .json({ message: "No invite details found for this cont_id." });
    }

    // 초대자 정보 그룹화 (user_id 기준으로)
    const inviterDetails = {};
    inviteData.forEach((invite) => {
      const userId = invite.user?.user_id;
      if (!inviterDetails[userId]) {
        inviterDetails[userId] = {
          inviterName: invite.user?.user_name || "Unknown",
          email: invite.invite_email,
          wallet: invite.user?.wallet_addr || "Unknown",
          invitedMembers: 0,
          acceptedMembers: 0,
          rejectedMembers: 0,
          inviteeList: [],
        };
      }

      // 각 초대자의 초대 멤버 수 및 상태 정보 업데이트
      inviterDetails[userId].invitedMembers += 1;
      if (invite.status === "APPLIED")
        inviterDetails[userId].acceptedMembers += 1;
      if (invite.status === "DENIED")
        inviterDetails[userId].rejectedMembers += 1;

      inviterDetails[userId].inviteeList.push({
        inviteeEmail: invite.invite_email,
        status: invite.status,
        inviteDate: invite.invite_date || "--",
        statusDate: invite.status_date || "--",
      });
    });

    // 최종 결과를 배열로 변환하여 응답
    res.json(Object.values(inviterDetails));
  } catch (error) {
    console.error("Error fetching invite details:", error);
    res.status(500).json({ message: "Failed to fetch invite details" });
  }
};
