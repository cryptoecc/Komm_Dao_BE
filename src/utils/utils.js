const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const generatePin = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6자리 PIN 번호 생성
};

const loginAttemptLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 5, // 15분 동안 최대 5번의 시도 허용
  message: "Too many login attempts. Please try again later.",
});

module.exports = {
  generatePin,
  generateToken,
  verifyToken,
  loginAttemptLimit,
};
