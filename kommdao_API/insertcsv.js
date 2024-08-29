const csvParser = require("csv-parser");
const fs = require("fs");
const path = require("path");
const { sequelize, ProjectInfo } = require("../models"); // Sequelize 인스턴스와 모델 불러오기
const dotenv = require("dotenv");

// 환경 변수 로드
const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// CSV 파일 경로 (이 경로는 프로젝트 구조에 따라 수정)
const csvFilePath = path.resolve(
  __dirname,
  "../kommdao_API/2024-08-26_lecca_output.csv"
);

// CSV 파일의 헤더를 수동으로 정의
const headers = [
  "project_name",
  "summary",
  "category",
  "website",
  "twitter",
  "discord",
  "github",
  "founders_info",
  "linkedin",
  "fundraising_amount",
  "valuation",
  "investors",
  "is_invested",
  "source",
];

// CSV 파일을 읽어 데이터베이스에 삽입
fs.createReadStream(csvFilePath)
  .pipe(csvParser({ headers: headers }))
  .on("data", async (row) => {
    try {
      console.log(row); // row 객체 전체를 출력하여 제대로 파싱되고 있는지 확인
      await ProjectInfo.create({
        pjt_name: row.project_name || "Unknown Project",
        pjt_summary: row.summary || "No summary available",
        category: row.category || "Uncategorized",
        website: row.website || "http://example.com",
        x_link: row.twitter || "http://twitter.com/default",
        discord_link: row.discord || "http://discord.com/default",
        github_link: row.github || "http://github.com/default",
        linkedIn_link: row.linkedin || "http://linkedin.com/default",
        raising_amount: row.fundraising_amount || 0,
        valuation: row.valuation || 0,
        investors: row.investors || "No investors",
        source: row.source || "Unknown source",
        create_date: new Date(), // create_date 기본값 설정
        update_yn: "N", // update_yn 기본값 설정
        apply_date: new Date(), // apply_date 기본값 설정
        apply_yn: "N", // apply_yn 기본값 설정
      });
      console.log(`Inserted: ${row.project_name}`);
    } catch (error) {
      console.error(`Error inserting row: ${error.message}`);
    }
  })
  .on("end", () => {
    console.log("CSV file successfully processed");
  })
  .on("error", (error) => {
    console.error(`Error reading CSV file: ${error.message}`);
  });
