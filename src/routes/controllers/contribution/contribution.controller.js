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
