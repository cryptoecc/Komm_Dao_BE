const {
  ContributionInfo,
  ContributionMissions,
  UserInfo,
  UserInviteContribution,
  UserContribution,
  sequelize,
} = require("../../../../models/index");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");

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

// HTML 파일 경로 설정
const emailTemplatePath = path.join(
  __dirname,
  "../../../utils/templates/inviteTemplate.html"
);
console.log(emailTemplatePath);

// 이메일 전송 함수
const sendEmail = async (recipient, subject, inviterName, recipientName) => {
  const template = fs.readFileSync(emailTemplatePath, "utf-8");

  const htmlContent = template
    .replace(/{{INVITER_NAME}}/g, inviterName)
    .replace(/{{RECIPIENT_NAME}}/g, recipientName);

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: recipient,
    subject,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

// 초대 이메일 발송 및 데이터베이스 저장 로직
exports.sendInviteEmails = async (req, res) => {
  const { cont_id, user_id, members } = req.body;

  console.log(req.body);

  try {
    // cont_id를 이용하여 ms_id 찾기
    const mission = await ContributionMissions.findOne({ where: { cont_id } });
    const user = await UserInfo.findOne({ where: { user_id } });

    if (!mission) {
      return res
        .status(404)
        .json({ message: "Contribution mission not found" });
    }

    const ms_id = mission.ms_id;
    console.log(user.user_name);

    // 각 멤버에게 초대 이메일을 보내고 데이터베이스에 저장
    const invitePromises = members.map(async (member) => {
      // nodemailer로 이메일 발송
      await sendEmail(
        member.email,
        `[${user.user_name}] has Invited You to Join KommDAO!`,
        user.user_name,
        member.nickname
      );

      // USER_INVITE_CONTRIBUTION 테이블에 데이터 삽입
      await UserInviteContribution.create({
        cont_id,
        ms_id,
        user_id,
        invite_email: member.email,
        status: "PENDING",
      });
    });

    // 모든 이메일 발송 및 DB 저장이 완료될 때까지 기다림
    await Promise.all(invitePromises);

    // UserContribution 테이블에 중복 체크 후 데이터 삽입
    const existingContribution = await UserContribution.findOne({
      where: { cont_id, user_id, ms_id },
    });

    if (!existingContribution) {
      // 중복이 없을 때만 데이터 삽입
      await UserContribution.create({
        cont_id,
        user_id,
        ms_id,
        cont_type: "Invite", // 기여 유형을 'INVITE'로 설정
        claim_yn: "N",
        cont_xp: 0, // 기본 XP 값을 0으로 설정
      });
    } else {
      console.log(
        `Contribution entry already exists: cont_id=${cont_id}, user_id=${user_id}, ms_id=${ms_id}`
      );
    }
    res
      .status(200)
      .json({ success: true, message: "Invitations sent successfully" });
  } catch (error) {
    console.error("Error sending invite emails:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send invitations" });
  }
};

// Backend: 이메일 중복 체크 API
exports.checkDuplicateEmails = async (req, res) => {
  const { emails } = req.body; // 초대하려는 이메일 목록을 받습니다.

  try {
    // UserInfo 테이블에서 이메일이 존재하고 status가 APPLIED인 항목을 찾습니다.
    const existingUsers = await UserInfo.findAll({
      where: {
        email_addr: emails,
        appr_status: "APPLIED",
      },
      attributes: ["email_addr"], // 이메일만 반환
    });

    const existingEmails = existingUsers.map((user) => user.email_addr);

    res.status(200).json({ existingEmails });
  } catch (error) {
    console.error("Error checking duplicate emails:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAppliedInviteCount = async (req, res) => {
  const { cont_id, user_id } = req.body; // cont_id와 user_id를 요청 본문에서 받음

  try {
    // cont_id와 user_id에 해당하는 APPLIED 상태의 초대 정보를 가져옴
    const appliedInvitesCount = await UserInviteContribution.count({
      where: {
        cont_id,
        user_id,
        status: "APPLIED", // APPLIED 상태인 초대만 필터링
      },
    });

    // APPLIED 상태의 초대 개수 반환
    res.json({ appliedInvitesCount });
  } catch (error) {
    console.error("Error fetching applied invite count:", error);
    res.status(500).json({ message: "Failed to fetch applied invite count" });
  }
};

exports.getUserXpPoint = async (req, res) => {
  const { user_id, cont_id } = req.body;

  console.log(cont_id);

  try {
    const userContribution = await UserContribution.findOne({
      where: {
        cont_id,
        user_id,
      },
      attributes: ["cont_xp", "cont_type"],
    });

    if (!userContribution) {
      return res
        .status(404)
        .json({ message: "No XP points found for this user" });
    }

    console.log(userContribution.cont_type);
    res.status(200).json({
      cont_xp: userContribution.cont_xp,
      cont_type: userContribution.cont_type,
    });
  } catch (error) {
    console.error("Error fetching get Xp", error);
    res.status(500).json({ message: "Failed to fetch get Xp" });
  }
};

exports.updateXpPoint = async (req, res) => {
  const { total_xp, user_id, cont_id } = req.body;

  const t = await sequelize.transaction(); // 트랜잭션 시작

  try {
    // user_id와 cont_id를 기준으로 UserContribution 데이터를 찾음
    const userContribution = await UserContribution.findOne({
      where: { user_id, cont_id },
      transaction: t, // 트랜잭션 추가
    });

    if (!userContribution) {
      await t.rollback();

      return res.status(404).json({ message: "UserContribution not found" });
    }

    // ContributionInfo 테이블에서 cont_id에 해당하는 데이터를 조회하여 max_participant와 cur_participant 확인
    const contributionInfo = await ContributionInfo.findOne({
      where: { cont_id },
      transaction: t,
    });

    if (!contributionInfo) {
      await t.rollback();
      return res.status(404).json({ message: "ContributionInfo not found" });
    }

    // cont_type이 "Daily-check"가 아닌 경우에만 max_participant와 cur_participant 비교
    if (
      contributionInfo.cont_type !== "Daily-check" &&
      contributionInfo.cont_type !== "Rate-project"
    ) {
      if (
        contributionInfo.cur_participant >= contributionInfo.max_participant
      ) {
        await t.rollback();
        return res.status(400).json({
          message: "Max participants reached, no further updates allowed.",
        });
      }
    }

    // cont_xp를 0으로 초기화하고, total_xp에 받은 cont_xp 값을 더함
    userContribution.cont_xp = 0;
    userContribution.total_xp = (userContribution.total_xp || 0) + total_xp;

    // claim_yn이 "Y"일 경우 "N"으로 업데이트
    if (userContribution.claim_yn === "Y") {
      userContribution.claim_yn = "N";
    }

    if (userContribution.participant_yn === "N") {
      userContribution.participant_yn = "Y";
    }

    // 데이터 저장
    await userContribution.save({ transaction: t });

    // participant_yn이 "Y"인 UserContributionInfo 레코드를 카운트
    const participantCount = await UserContribution.count({
      where: {
        cont_id, // 동일한 cont_id에서
        participant_yn: "Y", // participant_yn이 "Y"인 경우만 카운트
      },
      transaction: t, // 트랜잭션 추가
    });

    // ContributionInfo 테이블의 cur_participant를 업데이트
    await ContributionInfo.update(
      { cur_participant: participantCount }, // 새로운 participant 카운트로 업데이트
      { where: { cont_id }, transaction: t }
    );

    await t.commit(); // 트랜잭션 커밋

    res.status(200).json({ message: "XP updated successfully" });
  } catch (error) {
    console.error("Error updating XP:", error);
    res.status(500).json({ message: "Failed to update XP" });
  }
};

exports.checkUserConfirm = async (req, res) => {
  const { cont_id, user_id } = req.body;

  try {
    // ContributionMissions 테이블에서 cont_id로 ms_id 가져오기
    const contributionMission = await ContributionMissions.findOne({
      where: { cont_id },
      attributes: ["ms_id"], // ms_id만 가져오기
    });

    console.log(contributionMission);

    if (!contributionMission) {
      return res
        .status(404)
        .json({ message: "No missions found for this contribution." });
    }

    const ms_id = contributionMission.ms_id;
    console.log(ms_id);

    // UserContribution 테이블에서 cont_id, ms_id, user_id로 데이터를 조회하여 claim_yn 가져오기
    const userContribution = await UserContribution.findOne({
      where: {
        cont_id,
        ms_id,
        user_id,
      },
      attributes: ["claim_yn"], // claim_yn만 가져오기
    });

    console.log("asd", userContribution);

    if (!userContribution || userContribution == null) {
      return res
        .status(404)
        .json({ message: "No user contribution found for this mission." });
    }

    // claim_yn 값을 프론트로 응답
    return res.status(200).json({ claim_yn: userContribution.claim_yn });
  } catch (error) {
    console.error("Error checking user confirmation:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.handleDailyCheck = async (req, res) => {
  const { cont_id, user_id, cont_type } = req.body;
  console.log(cont_type);
  try {
    // 1. cont_id로 ContributionMissions에서 ms_id 가져오기
    const mission = await ContributionMissions.findOne({
      where: { cont_id },
      attributes: ["ms_id"],
    });

    if (!mission) {
      return res
        .status(404)
        .json({ message: "No mission found for the given cont_id" });
    }

    const ms_id = mission.ms_id;

    // 2. UserContribution에서 user_id, cont_id, ms_id로 레코드 찾기
    const existingContribution = await UserContribution.findOne({
      where: { user_id, cont_id, ms_id },
    });

    // 3. 레코드가 없으면 새로 생성하고 바로 응답 반환
    if (!existingContribution) {
      await UserContribution.create({
        cont_id,
        user_id,
        ms_id,
        cont_type,
        claim_yn: "N", // 기본값으로 설정
        cont_xp: 0, // 기본 XP 값 설정
        total_xp: 0,
        participant_yn: "N", // 기본값으로 설정
      });

      return res
        .status(201)
        .json({ message: "UserContribution created successfully" });
    }

    // 4. 이미 레코드가 존재하면 claim_yn 업데이트 및 반환
    await existingContribution.update({
      cont_xp: (existingContribution.cont_xp = 20), // XP 20 증가
      claim_yn: "Y", // claim_yn을 "Y"로 변경
      cont_type: cont_type,
    });

    return res.status(200).json({
      message: "UserContribution updated successfully",
      claim_yn: "Y",
    });
  } catch (error) {
    console.error("Error handling daily check:", error);
    // 에러 발생 시 응답
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.dailyCheckConfirm = async (req, res) => {
  const { cont_id, user_id, cont_type } = req.body;

  try {
    // 1. UserContribution에서 해당 유저, 컨트리뷰션 ID, 타입으로 레코드 조회
    const userContribution = await UserContribution.findOne({
      where: { cont_id, user_id, cont_type },
      attributes: ["claim_yn", "participant_yn"], // 필요한 필드만 조회
    });

    // 2. 데이터가 없는 경우
    if (!userContribution) {
      return res
        .status(404)
        .json({ message: "No user contribution found for this mission." });
    }

    // 3. 데이터가 있는 경우 claim_yn 값 반환
    res.status(200).json({
      claim_yn: userContribution.claim_yn,
      participant_yn: userContribution.participant_yn,
    });
  } catch (error) {
    console.error("Error fetching user contribution:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.rateCheckConfirm = async (req, res) => {
  const { cont_id, user_id, cont_type } = req.body;

  try {
    // 1. UserContribution에서 해당 유저, 컨트리뷰션 ID, 타입으로 레코드 조회
    const userContribution = await UserContribution.findOne({
      where: { cont_id, user_id, cont_type },
      attributes: ["claim_yn", "participant_yn"], // 필요한 필드만 조회
    });

    // 2. 데이터가 없는 경우
    if (!userContribution) {
      return res
        .status(404)
        .json({ message: "No user contribution found for this mission." });
    }

    // 3. 데이터가 있는 경우 claim_yn 값 반환
    res.status(200).json({
      claim_yn: userContribution.claim_yn,
      participant_yn: userContribution.participant_yn,
    });
  } catch (error) {
    console.error("Error fetching user contribution:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.handleRateCheck = async (req, res) => {
  const { cont_id, user_id, cont_type, rate_project } = req.body;
  console.log(cont_type);
  try {
    // 1. cont_id로 ContributionMissions에서 ms_id 가져오기
    const mission = await ContributionMissions.findOne({
      where: { cont_id },
      attributes: ["ms_id"],
    });

    if (!mission) {
      return res
        .status(404)
        .json({ message: "No mission found for the given cont_id" });
    }

    const ms_id = mission.ms_id;

    // 2. UserContribution에서 user_id, cont_id, ms_id로 레코드 찾기
    const existingContribution = await UserContribution.findOne({
      where: { user_id, cont_id, ms_id },
    });

    // 3. 레코드가 없으면 새로 생성하고 응답 반환
    if (!existingContribution) {
      await UserContribution.create({
        cont_id,
        user_id,
        ms_id,
        cont_type,
        claim_yn: "N", // 기본값 설정
        cont_xp: 0, // 기본 XP 값 설정
        total_xp: 0,
        participant_yn: "N", // 기본값 설정
      });

      return res
        .status(201)
        .json({ message: "UserContribution created successfully" });
    }

    // 4. participant_yn이 "Y"가 아닌 경우만 업데이트 진행
    if (existingContribution.participant_yn !== "Y") {
      if (rate_project >= 10) {
        await existingContribution.update({
          cont_xp: 100, // XP 100으로 증가
          claim_yn: "Y", // claim_yn을 "Y"로 변경
          cont_type: cont_type,
        });

        return res.status(200).json({
          message: "UserContribution updated successfully",
          claim_yn: "Y",
        });
      }
    }

    // rate_project가 10 미만일 경우 업데이트하지 않음
    return res.status(200).json({
      message: "UserContribution exists but rate_project is less than 10",
    });
  } catch (error) {
    console.error("Error handling rate check:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getParticipant = async (req, res) => {
  const { cont_id, cont_type } = req.body;
  console.log(cont_id, cont_type);

  try {
    const participant = await UserContribution.findAll({
      where: {
        cont_id: cont_id,
        cont_type: cont_type,
        participant_yn: "Y",
      },
      attributes: ["user_id"],
    });

    console.log(participant);

    // participant가 없을 경우 빈 배열 반환
    if (!participant || participant.length === 0) {
      return res.status(200).json({ participant: [] });
    }

    // 3. user_id 배열 생성
    const userIds = participant.map((participant) => participant.user_id);
    // 4. UserInfo에서 user_id에 해당하는 user_image_link 가져오기
    const userInfo = await UserInfo.findAll({
      where: {
        user_id: userIds, // 여러 user_id에 대해 조회
      },
      attributes: ["user_name", "user_image_link"], // 필요한 필드만 가져오기
    });

    // 5. 최종 데이터 프론트로 반환
    return res.status(200).json({ participants: userInfo });
  } catch (error) {
    console.error("Error fetching get data", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 매일 아침 10시에 participant_yn 값을 "Y"에서 "N"으로 변경하는 작업 설정
cron.schedule("0 10 * * *", async () => {
  try {
    console.log("Starting cron job to reset participant_yn values...");

    // participant_yn이 "Y"인 모든 레코드를 "N"으로 업데이트
    const [updatedRows] = await UserContribution.update(
      { participant_yn: "N" }, // 업데이트할 값
      { where: { cont_type: "Daily-check" } } // 조건: participant_yn이 "Y"인 레코드만
    );

    console.log(`Updated ${updatedRows} rows where participant_yn was "Y"`);
  } catch (error) {
    console.error("Error during cron job:", error);
  }
});
