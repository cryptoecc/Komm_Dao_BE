const { DEAL_INFO } = require("../../../../models"); // Adjust the path if necessary

// Function to get all deals
const getDeals = async (req, res) => {
  try {
    // Fetch deals from the database
    const deals = await DEAL_INFO.findAll();

    // Log the raw deals data
    console.log("Raw deals data:", deals);

    // Transform the deals into the desired format, if necessary
    const transformedDeals = deals.map((deal) => ({
      deal_id: deal.deal_id,
      deal_name: deal.deal_name,
      description: deal.deal_desc,
      summary: deal.deal_summary,
      amount: deal.total_interest || 0, // default 값 추가
      percentage:
        deal.total_interest && deal.final_cap
          ? Math.round((deal.total_interest / deal.final_cap) * 100)
          : 0, // 만약 값이 없을 때 0으로 설정
      start_date: deal.start_date,
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

// 특정 Deal을 ID로 가져오는 API
const getDealById = async (req, res) => {
  try {
    const dealId = req.params.dealId; // dealId는 요청 URL에서 가져옴
    const deal = await DEAL_INFO.findOne({
      where: { deal_id: dealId },
    });

    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    // 응답할 데이터 형태로 변환
    const transformedDeal = {
      deal_id: deal.deal_id,
      deal_name: deal.deal_name,
      deal_desc: deal.deal_desc,
      final_amount: deal.final_cap,
      percentage: Math.round((deal.total_interest / deal.final_cap) * 100),
      start_date: deal.start_date,
      end_date: deal.end_date,
      deal_image_url: deal.deal_logo,
      banner_image_url: deal.deal_background,
      deal_status: deal.deal_status,
      deal_round: deal.deal_round,
    };

    res.json(transformedDeal); // 변환된 데이터를 JSON 형식으로 응답
  } catch (error) {
    console.error("Error fetching deal by ID:", error);
    res.status(500).json({ message: "Error fetching deal" });
  }
};

module.exports = {
  getDeals,
  getDealById,
};
