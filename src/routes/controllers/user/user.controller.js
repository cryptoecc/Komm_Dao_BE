const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { generatePin } = require("../../../utils/utils");
const { EmailLog } = require("../../../../models/index");
const { UserInfo } = require("../../../../models/index");
const upload = require("../../../utils/multer");

exports.sendEmail = async (req, res) => {
  const { email } = req.body;

  const pin = generatePin();

  const emailTemplatePath = path.join(
    __dirname,
    "../../../utils/templates/pincodeTemplate.html"
  );

  try {
    // HTML 파일 읽기
    let emailTemplate = fs.readFileSync(emailTemplatePath, "utf8");

    // 템플릿에 동적 데이터 삽입
    emailTemplate = emailTemplate.replace("{{PINCODE}}", pin);

    // nodemailer transporter 생성
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // 이메일 옵션 설정
    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: email,
      subject: "Welcome to Komm DAO. Verify Your Email Address",
      html: emailTemplate, // HTML 본문 설정
    };

    // 이메일 전송
    await transporter.sendMail(mailOptions);

    // PIN 번호를 데이터베이스에 저장
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 5); // PIN 번호 5분 유효

    await EmailLog.create({
      request_dt: new Date(),
      from_addr: process.env.EMAIL_ID,
      to_addr: email,
      pin_code: pin,
      pin_expiry: expiryDate,
      send_stat_cd: "SENT",
      send_stat_cd_nm: "Sent Successfully",
      registed_by: "system",
      regist_date: new Date(),
    });

    res.status(200).send({ success: true });
  } catch (error) {
    console.error("Failed to send email:", error);
    res.status(500).send({ success: false, message: "Failed to send email" });
  }
};

exports.verifyPin = async (req, res) => {
  const { email, pin } = req.body;

  try {
    const emailLog = await EmailLog.findOne({
      where: {
        to_addr: email,
        pin_code: pin,
      },
      order: [["request_dt", "DESC"]], // 최신 요청 우선
    });

    if (!emailLog) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid PIN or email." });
    }

    const currentTime = new Date();
    if (currentTime > emailLog.pin_expiry) {
      return res
        .status(400)
        .send({ success: false, message: "PIN has expired." });
    }

    // PIN 유효
    res
      .status(200)
      .send({ success: true, mssage: "PIN verified successfully." });
  } catch (error) {
    console.error("Error verifying PIN:", error);
    res.status(500).send({ success: false, message: "Failed to verify PIN." });
  }
};

exports.submit = async (req, res) => {
  const {
    user_name,
    email_addr,
    wallet_addr,
    expertise,
    bio,
    value_add,
    reg_date,
    appr_status,
    cur_xp,
    last_login_date,
    nft_link,
    voting_power,
    activate_yn,
  } = req.body;

  console.log(bio);
  console.log(value_add);
  console.log(voting_power);

  console.log("Request File:", req.file);

  try {
    const uploadedUserImageLink = req.file
      ? `uploads/${req.file.filename}`
      : `uploads/profile_default.png`;

    // 데이터베이스에 사용자 데이터 저장
    await UserInfo.create({
      user_name,
      email_addr,
      wallet_addr,
      expertise,
      bio,
      value_add,
      reg_date,
      appr_status,
      cur_xp,
      last_login_date: null,
      nft_link,
      user_image_link: uploadedUserImageLink, // 업로드된 이미지 또는 디폴트 이미지 경로 저장
      voting_power,
      activate_yn,
    });

    // 응답을 한 번만 보내도록 수정
    res
      .status(200)
      .send({ success: true, message: "Data submitted successfully." });
    // 업로드된 이미지 파일 경로
  } catch (error) {
    console.error("Error submitting data:", error);
    res.status(500).send({ success: false, message: "Failed to submit data." });
  }
};
// exports.uploadImg = async (req, res) => {
//   console.log("upload");
//   // const { image } = req.body;
//   // console.log(image)
// };
