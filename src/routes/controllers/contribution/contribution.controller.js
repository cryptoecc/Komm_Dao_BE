const {
  ContributionInfo,
  ContributionMissions,
  UserInfo,
  UserInviteContribution,
  UserContribution,
} = require("../../../../models/index");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

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
      attributes: ["cont_xp"],
    });

    if (!userContribution) {
      return res
        .status(404)
        .json({ message: "No XP points found for this user" });
    }

    res.status(200).json({ cont_xp: userContribution.cont_xp });
  } catch (error) {
    console.error("Error fetching get Xp", error);
    res.status(500).json({ message: "Failed to fetch get Xp" });
  }
};

exports.updateXpPoint = async (req, res) => {
  const { total_xp, user_id, cont_id } = req.body;

  try {
    // user_id와 cont_id를 기준으로 UserContribution 데이터를 찾음
    const userContribution = await UserContribution.findOne({
      where: { user_id, cont_id },
    });

    if (!userContribution) {
      return res.status(404).json({ message: "UserContribution not found" });
    }

    // cont_xp를 0으로 초기화하고, total_xp에 받은 cont_xp 값을 더함
    userContribution.cont_xp = 0;
    userContribution.total_xp = (userContribution.total_xp || 0) + total_xp;

    // claim_yn이 "Y"일 경우 "N"으로 업데이트
    if (userContribution.claim_yn === "Y") {
      userContribution.claim_yn = "N";
    }

    // 데이터 저장
    await userContribution.save();

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

    if (!contributionMission) {
      return res
        .status(404)
        .json({ message: "No missions found for this contribution." });
    }

    const ms_id = contributionMission.ms_id;

    // UserContribution 테이블에서 cont_id, ms_id, user_id로 데이터를 조회하여 claim_yn 가져오기
    const userContribution = await UserContribution.findOne({
      where: {
        cont_id,
        ms_id,
        user_id,
      },
      attributes: ["claim_yn"], // claim_yn만 가져오기
    });

    if (!userContribution) {
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
