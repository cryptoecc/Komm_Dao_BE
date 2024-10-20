const {
  UserRating,
  ProjectInfo,
  UserInfo,
  sequelize,
} = require("../../../../models");

// 프로젝트의 모든 평균 평점 가져오는 함수 추가
UserRating.getAllProjectRatings = async function () {
  return await sequelize.query(
    `SELECT pjt_id, AVG(rating) as averageRating
     FROM USER_RATING
     WHERE rating_yn = 'Y'
     GROUP BY pjt_id`,
    {
      type: sequelize.QueryTypes.SELECT, // 올바른 QueryTypes 사용
    }
  );
};

// 프로젝트 상세 정보 가져오는 함수
const getProjectDetails = async (req, res) => {
  const { pjt_id } = req.params;

  try {
    // 프로젝트 정보 가져오기
    const project = await ProjectInfo.findOne({
      where: { pjt_id },
      attributes: ["pjt_id", "pjt_name", "pjt_summary", "pjt_details"],
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // 특정 프로젝트의 평균 평점 계산
    const averageRating = await UserRating.calculateAverageRating(pjt_id);

    // 모든 프로젝트의 평균 평점 가져오기
    const allProjectRatings = await UserRating.getAllProjectRatings();

    // 모든 프로젝트의 평균 평점 중 현재 프로젝트의 백분율 계산
    const sortedRatings = allProjectRatings
      .map((proj) => parseFloat(proj.averageRating)) // 평균 평점을 숫자로 변환
      .sort((a, b) => a - b); // 오름차순 정렬

    const projectRank = sortedRatings.indexOf(averageRating) + 1;
    const percentile = parseFloat(
      ((projectRank / sortedRatings.length) * 100).toFixed(2)
    ); // 백분율 계산 후 숫자형으로 변환

    // 특정 프로젝트에 참여한 유저 목록 가져오기
    const participants = await UserRating.findAll({
      where: { pjt_id },
      attributes: ["user_id", "rating", "rating_yn", "rating_date"],
      include: {
        model: UserInfo,
        as: "UserInfo",
        attributes: ["user_name", "user_image_link", "wallet_addr"],
      },
    });

    // 참가자 정보를 매핑해서 전달
    const participantData = participants.map((participant) => ({
      user_id: participant.user_id,
      user_name: participant.UserInfo.user_name,
      user_image_link: participant.UserInfo.user_image_link,
      wallet_addr: participant.UserInfo.wallet_addr,
      rating: participant.rating,
    }));
    console.log("Calculated Percentile:", percentile); // 백엔드에서 추가 확인

    // 프로젝트 관련 데이터 응답
    res.json({
      project: {
        pjt_id: project.pjt_id,
        pjt_name: project.pjt_name,
        avg_rating: averageRating,
        pjt_summary: project.pjt_summary,
        pjt_details: project.pjt_details,
        percentile, // 백분율을 숫자형으로 응답
      },
      participants: participantData,
    });
  } catch (error) {
    console.error("Error fetching project details:", error);
    res.status(500).json({ message: "Failed to fetch project details." });
  }
};

module.exports = {
  getProjectDetails,
};
