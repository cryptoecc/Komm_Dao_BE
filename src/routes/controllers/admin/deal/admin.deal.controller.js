require("dotenv").config();
const { DealInfo } = require("../../../../../models/index");

exports.createDeal = async (req, res) => {
  try {
    // 이미지 파일 경로 설정
    const profileImageLink = req.files.profileImage
      ? `uploads/deal/${req.files.profileImage[0].filename}`
      : `uploads/deal/logo_default.png`;

    const bannerImageLink = req.files.bannerImage
      ? `uploads/deal/${req.files.bannerImage[0].filename}`
      : `uploads/deal/banner_default.png`;

    // 요청 데이터 받기
    const {
      pjt_id,
      pjt_name,
      deal_round,
      start_date,
      end_date,
      deal_summary,
      deal_desc,
      min_interest,
      max_interest,
    } = req.body;

    // 데이터베이스에 새로운 Deal 저장
    const newDeal = await DealInfo.create({
      pjt_id, // Project ID를 정수로 변환
      deal_name: pjt_name,
      deal_round,
      deal_logo: profileImageLink,
      deal_background: bannerImageLink,
      start_date,
      end_date,
      deal_summary,
      deal_desc,
      min_interest,
      max_interest,
      create_date: new Date(),
    });

    res
      .status(201)
      .json({ message: "Deal created successfully", deal: newDeal });
  } catch (error) {
    console.error("Error creating deal:", error);
    res
      .status(500)
      .json({ message: "Failed to create deal", error: error.message });
  }
};
