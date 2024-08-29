require("dotenv").config();
const { ProjectInfo } = require("../../../../../models/index");
const { Op } = require("sequelize");

exports.projectList = async (req, res) => {
  try {
    const projects = await ProjectInfo.findAll({
      attributes: [
        "pjt_id",
        "pjt_name",
        "website",
        "category",
        "x_link",
        "x_followers",
        "discord_link",
        "discord_members",
        "linkedIn_link",
        "github_link",
        "github_stars",
        "raising_amount",
        "valuation",
        "investors",
        "pjt_grade",
        "pjt_summary",
        "pjt_details",
        "adm_trend",
        "adm_expertise",
        "adm_final_grade",
        "update_date",
        "apply_yn",
      ],
      order: [["update_date", "DESC"]], // 최신 업데이트가 먼저 오도록 정렬
    });

    // 날짜 형식을 가공
    const formattedProjects = projects.map((project) => ({
      ...project.toJSON(),
      update_date: project.update_date
        ? project.update_date.toISOString().split("T")[0]
        : null,
    }));

    res.json(formattedProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
