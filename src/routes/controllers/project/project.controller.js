const { ProjectInfo } = require("../../../../../models");

// 프로젝트 별점 업데이트
const updateProjectRating = async (req, res) => {
  const { projectId, rating } = req.body;

  try {
    const project = await ProjectInfo.findOne({ where: { pjt_id: projectId } });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 별점 평균 계산을 위한 로직
    const newTotalRating = (project.total_rating || 0) + rating;
    const newTotalVotes = (project.total_per || 0) + 1;
    const newAvgRating = newTotalRating / newTotalVotes;

    await ProjectInfo.update(
      {
        total_rating: newTotalRating,
        total_per: newTotalVotes,
        pjt_grade: newAvgRating.toFixed(2),
      },
      { where: { pjt_id: projectId } }
    );

    res.json({ message: "Project rating updated successfully", newAvgRating });
  } catch (error) {
    console.error("Error updating project rating:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { updateProjectRating };
