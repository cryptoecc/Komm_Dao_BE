require("dotenv").config();
const {
  ProjectInfo,
  DealInfo,
  ContributionInfo,
  UserWatchlist,
} = require("../../../../../models/index");
const { Op } = require("sequelize");

exports.mainProjectList = async (req, res) => {
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

exports.projectList = async (req, res) => {
  // const { searchTerm = "", page = 1, limit = 20 } = req.query;
  // const offset = (page - 1) * limit;

  try {
    const searchTerm = req.query.searchTerm || "";
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit;

    // 검색어 필터링 조건 추가 (프로젝트 이름이나 카테고리 검색)
    const whereClause = {
      [Op.or]: [
        { pjt_name: { [Op.like]: `%${searchTerm}%` } },
        { category: { [Op.like]: `%${searchTerm}%` } },
      ],
    };

    // 데이터와 전체 개수 가져오기 (페이지네이션 적용)
    const { rows: projects, count } = await ProjectInfo.findAndCountAll({
      where: whereClause, // 검색어 필터링 조건
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
      order: [["update_date", "DESC"]], // 최신 업데이트 순으로 정렬
      offset, // 페이지네이션을 위한 시작점
      limit, // 페이지 당 보여줄 개수
    });

    // 날짜 형식을 가공
    const formattedProjects = projects.map((project) => ({
      ...project.toJSON(),
      update_date: project.update_date
        ? project.update_date.toISOString().split("T")[0]
        : null,
    }));

    // 총 페이지 수 계산
    const totalPages = Math.ceil(count / limit);

    res.json({
      data: formattedProjects,
      totalPages,
      currentPage: parseInt(page, 10),
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.addProject = async (req, res) => {
  const {
    pjt_name,
    website,
    category,
    x_link,
    x_followers,
    discord_link,
    discord_members,
    linkedIn_link,
    github_link,
    github_stars,
    github_wkly_comm,
    raising_amount,
    valuation,
    investors,
    pjt_grade,
    pjt_summary,
    pjt_details,
    adm_trend,
    adm_expertise,
    adm_final_grade,
  } = req.body;

  try {
    // 새로운 프로젝트 데이터를 생성
    const newProject = await ProjectInfo.create({
      pjt_name,
      website,
      category,
      x_link,
      x_followers,
      discord_link,
      discord_members,
      linkedIn_link,
      github_link,
      github_stars,
      github_wkly_comm,
      raising_amount,
      valuation,
      investors,
      pjt_grade,
      pjt_summary,
      pjt_details,
      adm_trend,
      adm_expertise,
      adm_final_grade,
      create_date: new Date(), // 현재 날짜로 설정
      update_date: new Date(), // 현재 날짜로 설정
      apply_yn: "N", // 기본값 설정
    });

    res.status(200).json({
      message: "Project created successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Error adding project:", error);
    res
      .status(500)
      .json({ message: "Failed to add project", error: error.message });
  }
};

exports.deleteProjects = async (req, res) => {
  const { ids } = req.body;

  try {
    // DEAL_INFO와 CONTRIBUTION_INFO에서 pjt_id 존재 여부 확인
    const projectsInDealInfo = await DealInfo.findAll({
      where: {
        pjt_id: { [Op.in]: ids },
      },
    });

    const projectsInContributionInfo = await ContributionInfo.findAll({
      where: {
        pjt_id: { [Op.in]: ids },
      },
    });

    // 삭제 불가능한 프로젝트 ID 리스트 (DEAL_INFO 또는 CONTRIBUTION_INFO에 속한 경우)
    const undeletableIds = [
      ...projectsInDealInfo.map((project) => project.pjt_id),
      ...projectsInContributionInfo.map((project) => project.pjt_id),
    ];

    // 삭제 가능한 프로젝트 ID 리스트
    const deletableIds = ids.filter((id) => !undeletableIds.includes(id));

    // USER_WATCHLIST에서 삭제 가능한 프로젝트 삭제
    await UserWatchlist.destroy({
      where: {
        pjt_id: { [Op.in]: deletableIds },
      },
    });

    // PROJECT_INFO에서 삭제 가능한 프로젝트 삭제
    await ProjectInfo.destroy({
      where: {
        pjt_id: { [Op.in]: deletableIds },
      },
    });

    // 삭제 불가능한 프로젝트가 있을 경우, 프론트에 메시지 전송
    if (undeletableIds.length > 0) {
      return res.status(200).json({
        message:
          "Some projects could not be deleted due to existing references.",
        undeletableIds,
      });
    }

    res.status(200).json({ message: "Projects deleted successfully" });
  } catch (error) {
    console.error("Error deleting projects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.appliedProject = async (req, res) => {
  try {
    const projects = await ProjectInfo.findAll({
      attributes: ["pjt_id", "pjt_name", "apply_yn"],
      where: {
        apply_yn: "Y",
      },
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

exports.projectApply = async (req, res) => {
  const { pjt_id } = req.body;

  try {
    const project = await ProjectInfo.findOne({ where: { pjt_id } });

    if (project) {
      project.apply_yn = "Y";
      project.apply_date = new Date();
      await project.save();
      res.status(200).json({ message: "Apply status updated successfully" });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    console.error("Error updating apply status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.projectUpdate = async (req, res) => {
  const { pjt_id, ...updateData } = req.body;

  console.log(pjt_id, updateData.pjt_name);
  try {
    const project = await ProjectInfo.findOne({ where: { pjt_id } });

    if (project) {
      // 전달된 필드만 업데이트
      Object.keys(updateData).forEach((key) => {
        project[key] = updateData[key];
      });
      project.update_date = new Date(); // 업데이트 시각을 현재 시각으로 설정
      await project.save();

      const updatepjtname = updateData.pjt_name;
      // pjt_name이 업데이트된 경우 관련 테이블들도 업데이트
      if (updatepjtname) {
        // DealInfo에서 deal_name 업데이트 (pjt_name + deal_round)
        await DealInfo.update(
          { deal_name: updatepjtname },
          { where: { pjt_id } }
        );

        // ContributionInfo에서 pjt_name 업데이트
        await ContributionInfo.update(
          { pjt_name: updatepjtname },
          { where: { pjt_id } }
        );
      }

      res.status(200).json({ message: "Project updated successfully" });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
