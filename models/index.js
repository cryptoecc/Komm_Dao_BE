const { Sequelize, DataTypes } = require("sequelize");
const env = process.env.NODE_ENV || "development";
// const Test = require("../models/USER_INFO");

const configPath =
  env === "production" ? "config.production.json" : "config.local.json";

const config = require(`../config/${configPath}`);

const db = {};

const sequelize = new Sequelize(
  config.database || process.env.database,
  config.user || process.env.user,
  config.password || process.env.password,
  {
    host: config.host || process.env.host,
    dialect: "mysql",
  }
);

// const Info = Test(sequelize);

const UserInfo = require("./USER_INFO")(sequelize, DataTypes);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.UserInfo = UserInfo;

// sequelize
//   .sync({ force: false })
//   .then(() => {
//     console.log("Table created!");
//   })
//   .catch((error) => {
//     console.error("Failed to create table:", error);
//   });

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("데이터베이스 연결 성공.");
//   })
//   .catch((err) => {
//     console.error("데이터베이스 연결 실패:", err);
//   });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

module.exports = db;
