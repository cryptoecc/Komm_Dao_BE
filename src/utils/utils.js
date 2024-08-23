const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 사용자 정보를 req.user에 추가
    next(); // 다음 미들웨어 또는 라우트 핸들러로 이동
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token." });
  }
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
