const { USER_WATCHLIST, PROJECT_INFO } = require("../../../../../models");

// Watchlist에 프로젝트 추가
exports.addToWatchlist = async (req, res) => {
  const { user_id, pjt_id } = req.body;

  // 유효성 검사
  if (!user_id || !pjt_id) {
    return res
      .status(400)
      .json({ message: "Both user_id and pjt_id are required" });
  }

  try {
    // 이미 존재하는지 확인
    const existingEntry = await USER_WATCHLIST.findOne({
      where: { user_id, pjt_id },
    });

    if (existingEntry) {
      console.log(
        `Add to Watchlist Failed: Project with pjt_id ${pjt_id} is already in the watchlist for user_id ${user_id}`
      );
      return res
        .status(400)
        .json({ message: "Project is already in the watchlist" });
    }

    // 새로 추가
    const watchlistEntry = await USER_WATCHLIST.create({
      user_id,
      pjt_id,
      create_date: new Date(),
      update_date: new Date(),
    });

    console.log(
      `Project with pjt_id ${pjt_id} added to watchlist for user_id ${user_id}`
    );
    return res.status(201).json(watchlistEntry);
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    return res.status(500).json({
      message: "An error occurred while adding to the watchlist",
      error: error.message,
    });
  }
};

// Watchlist에서 프로젝트 삭제
exports.removeFromWatchlist = async (req, res) => {
  const { user_id, pjt_id } = req.body;

  // 유효성 검사
  if (!user_id || !pjt_id) {
    return res
      .status(400)
      .json({ message: "Both user_id and pjt_id are required" });
  }

  try {
    // 해당 유저의 Watchlist에서 프로젝트 삭제
    const deleteCount = await USER_WATCHLIST.destroy({
      where: { user_id, pjt_id },
    });

    if (deleteCount === 0) {
      console.log(
        `Remove from Watchlist Failed: Project with pjt_id ${pjt_id} not found in the watchlist for user_id ${user_id}`
      );
      return res
        .status(404)
        .json({ message: "Project not found in the watchlist" });
    }

    console.log(
      `Project with pjt_id ${pjt_id} removed from watchlist for user_id ${user_id}`
    );
    return res
      .status(200)
      .json({ message: "Project removed from watchlist successfully" });
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    return res.status(500).json({
      message: "Failed to remove project from watchlist",
      error: error.message,
    });
  }
};

// 유저의 Watchlist를 조회
exports.getUserWatchlist = async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ message: "user_id is required" });
  }

  try {
    const watchlist = await USER_WATCHLIST.findAll({
      where: { user_id },
      include: [
        {
          model: PROJECT_INFO,
          as: "project", // alias에 맞춰 사용
          attributes: [
            "pjt_id",
            "pjt_name",
            "category",
            "pjt_summary",
            "pjt_grade",
          ],
        },
      ],
    });

    console.log(`Fetched watchlist for user_id ${user_id}:`, watchlist);
    return res.status(200).json({ data: watchlist });
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch watchlist", error: error.message });
  }
};
