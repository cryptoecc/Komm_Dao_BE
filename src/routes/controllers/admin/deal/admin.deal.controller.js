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

exports.dealList = async (req, res) => {
  try {
    // Fetch deals from the database
    const deals = await DealInfo.findAll();

    // Log the raw deals data
    console.log("Raw deals data:", deals);

    // Transform the deals into the desired format, if necessary
    const transformedDeals = deals.map((deal) => ({
      pjt_id: deal.pjt_id,
      deal_id: deal.deal_id,
      deal_name: deal.deal_name,
      deal_desc: deal.deal_desc,
      deal_summary: deal.deal_summary,
      total_interest: deal.total_interest || 0, // default 값 추가
      percentage:
        deal.total_interest && deal.final_cap
          ? Math.round((deal.total_interest / deal.final_cap) * 100)
          : 0, // 만약 값이 없을 때 0으로 설정
      end_date: deal.end_date,
      deal_logo_url: deal.deal_logo || "", // deal_logo 전달
      deal_banner_url: deal.deal_background || "",
      deal_status: deal.deal_status || "PENDING", // deal 상태 전달
      deal_round: deal.deal_round || "N/A", // deal 라운드 전달
    }));

    // Log the transformed deals data
    console.log("Transformed deals data:", transformedDeals);

    // Send the deals as the response
    res.json(transformedDeals);
  } catch (error) {
    console.error("Error fetching deals:", error);
    res.status(500).json({ message: "Failed to fetch deals" });
  }
};

exports.updateDeal = async (req, res) => {
  try {
    // Deal ID를 가져옵니다.
    const { dealId } = req.params;

    // 파일이 존재하는지 확인하고 경로 설정
    const profileImageLink = req.files.profileImage
      ? `uploads/deal/${req.files.profileImage[0].filename}`
      : null; // 파일이 없다면 업데이트하지 않음

    const bannerImageLink = req.files.bannerImage
      ? `uploads/deal/${req.files.bannerImage[0].filename}`
      : null; // 파일이 없다면 업데이트하지 않음

    // 요청된 데이터 추출
    const {
      pjt_id,
      pjt_name,
      deal_round,
      end_date,
      deal_summary,
      deal_desc,
      min_interest,
      max_interest,
    } = req.body;

    // 업데이트할 데이터를 정의합니다.
    const updateData = {
      pjt_id, // Project ID 업데이트
      deal_name: pjt_name, // Deal Name 업데이트
      deal_round,
      end_date,
      deal_summary,
      deal_desc,
      min_interest,
      max_interest,
    };

    // 이미지가 제공되면 업데이트 데이터에 추가
    if (profileImageLink) {
      updateData.deal_logo = profileImageLink;
    }
    if (bannerImageLink) {
      updateData.deal_background = bannerImageLink;
    }

    // Deal 정보 업데이트
    const updatedDeal = await DealInfo.update(updateData, {
      where: { deal_id: dealId },
    });

    if (updatedDeal[0] === 0) {
      return res.status(404).json({ message: "Deal not found" });
    }

    // 업데이트 성공
    res
      .status(200)
      .json({ message: "Deal updated successfully", deal: updateData });
  } catch (error) {
    console.error("Error updating deal:", error);
    res
      .status(500)
      .json({ message: "Failed to update deal", error: error.message });
  }
};

exports.deleteDeal = async (req, res) => {
  try {
    const { dealId } = req.params;

    // Deal 삭제
    const deleted = await DealInfo.destroy({
      where: { deal_id: dealId },
    });

    // 삭제되지 않은 경우, 에러 처리
    if (!deleted) {
      return res.status(404).json({ message: "Deal not found" });
    }

    res.status(200).json({ message: "Deal deleted successfully" });
  } catch (error) {
    console.error("Error deleting deal:", error);
    res
      .status(500)
      .json({ message: "Failed to delete deal", error: error.message });
  }
};
