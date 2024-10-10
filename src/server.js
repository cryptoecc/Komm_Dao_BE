const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./routes");
const { sequelize, UserInfo, EmailLog } = require("../models");
const path = require("path");
const dotenv = require("dotenv");
const session = require("express-session");
const MemoryStore = require("memorystore")(session); // 메모리 저장소 사용
const RedisStore = require("connect-redis").default;
const redis = require("redis");

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: path.resolve(__dirname, envFile) });

const bcrypt = require("bcrypt");
const {
  updateDealStatus,
  updatePaymentVerifyStatus,
  updatePaymentStatus,
} = require("./routes/controllers/admin/deal/admin.deal.controller");

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

// status 자동 update
updateDealStatus();

// status 자동 update (verify)
updatePaymentVerifyStatus();

// Pay_Amount status update
updatePaymentStatus();

const app = express();
app.use(
  session({
    secret: "yourSecretKey", // 세션 암호화에 사용할 비밀 키
    resave: false, // 세션을 강제로 다시 저장할지 여부
    saveUninitialized: false, // 초기화되지 않은 세션을 저장할지 여부
    store: new MemoryStore({ checkPeriod: 86400000 }), // 세션 유지 시간 설정
    cookie: {
      secure: false, // https 사용 시 true로 설정
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 쿠키 만료 시간 설정 (1일)
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["http://localhost:3000", "http://52.78.177.57"],
    credentials: true,
  })
);
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
