const { Sequelize, DataTypes } = require("sequelize");
const env = process.env.NODE_ENV || "development";

const fs = require("fs");
const path = require("path");
// const Sequelize = require("sequelize");
const basename = path.basename(__filename);

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

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(
//     config.database,
//     config.username,
//     config.password,
//     config
//   );
// }

// fs.readdirSync(__dirname)
//   .filter((file) => {
//     return (
//       file.indexOf(".") !== 0 &&
//       file !== basename &&
//       file.slice(-3) === ".js" &&
//       file.indexOf(".test.js") === -1
//     );
//   })
//   .forEach((file) => {
//     const model = require(path.join(__dirname, file))(
//       sequelize,
//       Sequelize.DataTypes
//     );
//     db[model.name] = model;
//   });

// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Table created!");
  })
  .catch((error) => {
    console.error("Failed to create table:", error);
  });

sequelize
  .authenticate()
  .then(() => {
    console.log("데이터베이스 연결 성공.");
  })
  .catch((err) => {
    console.error("데이터베이스 연결 실패:", err);
  });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

module.exports = {
  sequelize,
};
