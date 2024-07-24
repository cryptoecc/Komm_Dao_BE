const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");

// 환경 설정 파일의 경로를 설정합니다.
const env = process.env.NODE_ENV || "development";
const configPath = path.resolve(__dirname, "../config/config.local.json"); // config.local.json을 정확히 지정

// 설정 파일을 읽어옵니다.
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

const db = {};

const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  dialect: config.dialect,
  port: config.port, // 포트 설정 추가
});

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

// 모델 간의 관계 설정
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

const UserInfo = require("./USER_INFO")(sequelize, DataTypes);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.UserInfo = UserInfo;

module.exports = db;
