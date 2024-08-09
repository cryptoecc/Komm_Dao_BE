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
      id: deal.deal_id,
      title: deal.deal_name,
      description: deal.deal_desc,
      amount: deal.final_amount,
      percentage: Math.round(
        (deal.current_interest / deal.total_interest) * 100
      ),
      start_date: deal.start_date, // 시작 날짜 전달
      end_date: deal.end_date, // 종료 날짜 전달
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

module.exports = {
  getDeals,
};
