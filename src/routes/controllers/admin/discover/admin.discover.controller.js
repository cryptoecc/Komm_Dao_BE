require("dotenv").config();
const {
  ProjectInfo,
  DealInfo,
  ContributionInfo,
  UserWatchlist,
} = require("../../../../../models/index");
const { Op } = require("sequelize");
const xlsx = require("xlsx");
const path = require("path");
const cron = require("node-cron");

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

// 엑셀 파일에서 투자자 데이터를 로드하는 함수
const loadInvestorData = () => {
  const filePath = path.join(
    __dirname,
    "../../../../utils/xlsx/Crypto_VCs_Tier.xlsx"
  ); // 엑셀 파일 경로

  console.log(filePath);
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const data = xlsx.utils.sheet_to_json(sheet);

  const tier1 = [],
    tier2 = [],
    tier3 = [];

  data.forEach((row) => {
    if (row["1티어"]) tier1.push(row["1티어"].trim());
    if (row["2티어"]) tier2.push(row["2티어"].trim());
    if (row["3티어"]) tier3.push(row["3티어"].trim());
  });

  return { tier1, tier2, tier3 };
};

// 투자자 품질 점수 계산 함수
const calculateInvestorQuality = (project_investors, tier1, tier2, tier3) => {
  const investors = project_investors.split(",").map((i) => i.trim());
  let investorQualityScore = 1; // 기본 점수는 1점 (3티어)

  investors.forEach((investor) => {
    if (tier1.includes(investor)) {
      investorQualityScore = Math.max(investorQualityScore, 3); // 1티어 투자자는 3점
    } else if (tier2.includes(investor)) {
      investorQualityScore = Math.max(investorQualityScore, 2); // 2티어 투자자는 2점
    }
  });

  return investorQualityScore * 0.25; // 25% 가중치 적용
};

// 기타 점수 계산 함수들
const calculateTwitterScore = (followers) => {
  if (followers >= 100000) return 3 * 0.1;
  else if (followers >= 50000) return 2 * 0.1;
  else return 1 * 0.1;
};

const calculateDiscordScore = (members) => {
  if (members >= 50000) return 3 * 0.05;
  else if (members >= 20000) return 2 * 0.05;
  else return 1 * 0.05;
};

const calculateGithubStarsScore = (stars) => {
  if (stars >= 300) return 3 * 0.05;
  else if (stars >= 100) return 2 * 0.05;
  else return 1 * 0.05;
};

const calculateWeeklyCommitsScore = (commits) => {
  if (commits >= 30) return 3 * 0.05;
  else if (commits >= 10) return 2 * 0.05;
  else return 1 * 0.05;
};

const calculateRaisingAmountScore = (raisingAmount) => {
  if (raisingAmount >= 1000000) return 3 * 0.05; // 예시: 100만 이상이면 3점
  else if (raisingAmount >= 500000) return 2 * 0.05; // 예시: 50만 이상이면 2점
  else return 1 * 0.05; // 나머지는 1점
};

// null 값 체크 및 평균 점수 계산 함수
const calculateFinalGrade = async (project, tier1, tier2, tier3) => {
  const scores = [];

  // 자동 계산 항목
  if (project.x_followers !== null) {
    const twitterScore = calculateTwitterScore(project.x_followers);
    scores.push(twitterScore / 0.1);
  }

  if (project.discord_members !== null) {
    const discordScore = calculateDiscordScore(project.discord_members);
    scores.push(discordScore / 0.05);
  }

  if (project.github_stars !== null) {
    const githubStarsScore = calculateGithubStarsScore(project.github_stars);
    scores.push(githubStarsScore / 0.05);
  }

  if (project.github_wkly_comm !== null) {
    const weeklyCommitsScore = calculateWeeklyCommitsScore(
      project.github_wkly_comm
    );
    scores.push(weeklyCommitsScore / 0.05);
  }

  if (project.raising_amount !== null) {
    const raisingAmountScore = calculateRaisingAmountScore(
      project.raising_amount
    );
    scores.push(raisingAmountScore / 0.05);
  }

  if (project.investors !== null) {
    const investorQualityScore = calculateInvestorQuality(
      project.investors,
      tier1,
      tier2,
      tier3
    );
    scores.push(investorQualityScore / 0.25);
  }

  // 수동 업데이트 항목
  if (project.adm_trend !== null && project.adm_trend !== "") {
    scores.push(parseFloat(project.adm_trend)); // 수동 항목은 그대로 점수로 반영
  }

  if (project.adm_expertise !== null && project.adm_expertise !== "") {
    scores.push(parseFloat(project.adm_expertise));
  }

  if (project.valuation !== null && project.valuation !== "") {
    scores.push(parseFloat(project.valuation));
  }

  console.log(`Project ${project.pjt_id} scores:`, scores); // 점수 배열 출력

  const nullCount = 9 - scores.length; // 9개 항목 중 null 값 개수 확인

  if (nullCount >= 3) {
    // 3개 이상 항목이 null이면 'N/A'로 설정
    await ProjectInfo.update(
      { adm_final_grade: "N/A" },
      { where: { pjt_id: project.pjt_id } }
    );
    console.log(`프로젝트 ${project.pjt_id}의 최종 등급: N/A (데이터 부족)`);
  } else {
    // 평균 점수 계산
    const totalScore = scores.reduce((acc, score) => acc + score, 0);
    const averageScore = totalScore / scores.length;

    await ProjectInfo.update(
      { adm_final_grade: averageScore.toFixed(2) },
      { where: { pjt_id: project.pjt_id } }
    );
    console.log(
      `프로젝트 ${project.pjt_id}의 최종 점수: ${averageScore.toFixed(2)}`
    );
  }
};

// 모든 프로젝트의 점수를 업데이트하는 함수
const updateAllProjects = async () => {
  // 엑셀 파일에서 투자자 데이터 로드
  const { tier1, tier2, tier3 } = loadInvestorData();

  // 모든 프로젝트 데이터 가져오기
  const projects = await ProjectInfo.findAll();

  // 각 프로젝트에 대해 점수를 계산하고 업데이트
  for (const project of projects) {
    await calculateFinalGrade(project, tier1, tier2, tier3);
  }

  console.log("모든 프로젝트 점수 업데이트 완료.");
};

// 매일 자정 10분에 실행되도록 설정
cron.schedule(
  "10 0 * * *",
  async () => {
    console.log("프로젝트 점수 업데이트 작업 시작...");
    try {
      await updateAllProjects();
      console.log("모든 프로젝트 점수 업데이트 완료.");
    } catch (error) {
      console.error("프로젝트 점수 업데이트 중 오류 발생:", error);
    }
  },
  {
    timezone: "Asia/Seoul", // 타임존 설정 (한국 시간 기준)
  }
);

console.log("스케줄러가 설정되었습니다.");
