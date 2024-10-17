const { sequelize } = require("../../../../models"); // Adjust the path if necessary

const {
  DEAL_INFO,
  USER_DEAL_INTEREST,
  USER_INFO,
} = require("../../../../models"); // Adjust the path if necessary

// Function to get all deals
const getDeals = async (req, res) => {
  try {
    // Fetch deals from the database
    const deals = await DEAL_INFO.findAll();

    // Log the raw deals data
    console.log("Raw deals data:", deals);

    // Transform the deals into the desired format, including create_date, min_interest, and max_interest
    const transformedDeals = deals.map((deal) => ({
      deal_id: deal.deal_id,
      deal_name: deal.deal_name,
      description: deal.deal_desc,
      summary: deal.deal_summary,
      amount: deal.total_interest || 0, // default 값 추가
      end_date: deal.end_date,
      deal_logo_url: deal.deal_logo || "", // deal_logo 전달
      deal_banner_url: deal.deal_background || "",
      deal_status: deal.deal_status || "PENDING", // deal 상태 전달
      deal_round: deal.deal_round || "N/A", // deal 라운드 전달
      create_date: deal.create_date || null, // create_date 추가
      min_interest: deal.min_interest || 0, // min_interest 추가
      max_interest: deal.max_interest || 0, // max_interest 추가
      final_amount: deal.final_cap || 0, // final_amount가 null일 경우 0으로 대체
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

// Function to get a specific deal by ID
const getDealById = async (req, res) => {
  try {
    const dealId = req.params.dealId; // dealId는 요청 URL에서 가져옴
    const deal = await DEAL_INFO.findOne({
      where: { deal_id: dealId },
    });

    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    // 응답할 데이터 형태로 변환, including create_date, min_interest, and max_interest
    const transformedDeal = {
      deal_id: deal.deal_id,
      deal_name: deal.deal_name,
      deal_desc: deal.deal_desc,
      final_amount: deal.final_cap || 0, // final_amount가 null일 경우 0으로 대체
      end_date: deal.end_date,
      deal_image_url: deal.deal_logo,
      banner_image_url: deal.deal_background,
      deal_status: deal.deal_status,
      deal_round: deal.deal_round,
      create_date: deal.create_date || null, // create_date 추가
      min_interest: deal.min_interest || 0, // min_interest 추가
      max_interest: deal.max_interest || 0, // max_interest 추가
      total_interest: deal.total_interest || 0, // total_interest 추가
    };

    res.json(transformedDeal); // 변환된 데이터를 JSON 형식으로 응답
  } catch (error) {
    console.error("Error fetching deal by ID:", error);
    res.status(500).json({ message: "Error fetching deal" });
  }
};

// Function to update user interest in a deal
const updateUserInterest = async (req, res) => {
  try {
    const dealId = req.params.dealId;
    const userId = req.params.userId;
    const { intAmount } = req.body;

    // Check if the deal and user exist
    const deal = await DEAL_INFO.findOne({ where: { deal_id: dealId } });
    const user = await USER_INFO.findOne({ where: { user_id: userId } });

    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the interest amount is within the valid range
    const minInterest = parseFloat(deal.min_interest);
    const maxInterest = parseFloat(deal.max_interest);

    if (intAmount < minInterest || intAmount > maxInterest) {
      return res.status(400).json({ message: "Interest amount out of range" });
    }

    // Find or create the user interest record
    const [userInterestRecord, created] = await USER_DEAL_INTEREST.findOrCreate(
      {
        where: {
          deal_id: dealId,
          user_id: userId,
        },
        defaults: {
          user_interest: intAmount, // 처음 추가 시 바로 해당 값을 설정
          create_date: new Date(), // create_date를 현재 날짜로 설정
          update_date: new Date(), // update_date를 현재 날짜로 설정
        },
      }
    );

    if (!created) {
      // If the record already exists, update the user_interest with the new intAmount
      await USER_DEAL_INTEREST.update(
        {
          user_interest: intAmount, // 기존 값에 더하지 않고, 최신 값으로 덮어씌움
          update_date: new Date(), // update_date를 현재 날짜로 설정
        },
        {
          where: {
            deal_id: dealId,
            user_id: userId,
          },
        }
      );
    }

    // Calculate the total interest by summing all user interests for this deal
    const totalInterest = await USER_DEAL_INTEREST.sum("user_interest", {
      where: { deal_id: dealId },
    });

    // Update the total_interest in DEAL_INFO with the summed user_interest values
    await DEAL_INFO.update(
      { total_interest: totalInterest },
      { where: { deal_id: dealId } }
    );

    res.status(200).json({ message: "Interest updated successfully" });
  } catch (error) {
    console.error("Error updating user interest:", error);
    res.status(500).json({ message: "Error updating user interest" });
  }
};

module.exports = {
  getDeals,
  getDealById,
  updateUserInterest,
};
