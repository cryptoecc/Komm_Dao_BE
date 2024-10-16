const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");

// 환경 변수 설정
const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: path.resolve(__dirname, "..", envFile) });

// 데이터베이스 설정 정보
const dbConfig = {
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT || 3306, // 포트가 설정되지 않은 경우 기본값 3306 사용
};

console.log(dbConfig);

// Sequelize 인스턴스 생성
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: "mysql",
    port: dbConfig.port, // 포트 설정 추가
    timezone: "+09:00", // 한국 시간대 설정
  }
);

const db = {};

// 모델 정의 및 불러오기
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== path.basename(__filename) &&
      file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

// 개별 모델 정의
const UserInfo = require("./USER_INFO")(sequelize, DataTypes);
const EmailLog = require("./USER_EMAIL_LOG")(sequelize, DataTypes);
const AdminUser = require("./ADMIN_USER")(sequelize, DataTypes);
const KommitteeInfo = require("./KOMMITTEE_INFO")(sequelize, DataTypes);
const KohortInfo = require("./KOHORT_INFO")(sequelize, DataTypes);
const KohortMember = require("./KOHORT_MEMBERS")(sequelize, DataTypes);
const Contracts = require("./CONTRACTS")(sequelize, DataTypes);
const ProjectInfo = require("./PROJECT_INFO")(sequelize, DataTypes);
const ContributionInfo = require("./CONTRIBUTION_INFO")(sequelize, DataTypes);
const ContributionMissions = require("./CONTRIBUTION_MISSIONS")(
  sequelize,
  DataTypes
);
const DealInfo = require("./DEAL_INFO")(sequelize, DataTypes);
const UserDealInterest = require("./USER_DEAL_INTEREST")(sequelize, DataTypes);
const UserInviteContribution = require("./USER_INVITE_CONTRIBUTION")(
  sequelize,
  DataTypes
);
const UserContribution = require("./USER_CONTRIBUTION")(sequelize, DataTypes);
const UserPointsHistory = require("./USER_POINTSHISTORY")(sequelize, DataTypes); // 추가된 부분

// 모델 등록
db.UserInfo = UserInfo;
db.EmailLog = EmailLog;
db.AdminUser = AdminUser;
db.KommitteeInfo = KommitteeInfo;
db.KohortInfo = KohortInfo;
db.KohortMember = KohortMember;
db.Contracts = Contracts;
db.ProjectInfo = ProjectInfo;
db.ContributionInfo = ContributionInfo;
db.ContributionMissions = ContributionMissions;
db.DealInfo = DealInfo;
db.UserDealInterest = UserDealInterest;
db.UserInviteContribution = UserInviteContribution;
db.UserContribution = UserContribution;
db.UserPointsHistory = UserPointsHistory;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// 모델 간의 관계 설정
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
