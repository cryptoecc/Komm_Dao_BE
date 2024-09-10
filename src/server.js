const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./routes");
const { sequelize, UserInfo, EmailLog } = require("../models");
const path = require("path");
const dotenv = require("dotenv");

// NODE_ENV에 따라 적절한 .env 파일을 로드합니다.
const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: path.resolve(__dirname, envFile) });

// const corsOptions = {
//   origin: ["*"],
//   // allowedHeaders: ["Authorization", "Content-Type"],
//   // credentials: true,
// };

const bcrypt = require("bcrypt");

const generateHashedPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);
  } catch (error) {
    console.error("Error hashing password:", error);
  }
};

// 예시 비밀번호로 해시 생성
generateHashedPassword("dao1541");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/uploads", express.static("src/assets/uploads"));

app.use(router);

const port = 4000;
const syncDB = process.env.SYNC_DB === "true";

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected...");
    if (syncDB) {
      return sequelize.sync({ alter: true }); // alter: true일 때 디비 동기화, false로 바꾸면 동기화x
    } else {
      return Promise.resolve();
    }
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
require("../models/index");
