const express = require("express");
const userController = require("./user.controller");
const upload = require("../../../utils/multer");
const profileRouter = require("./profile");
const watchlistRouter = require("./watchlist");
const userContributionController = require("./contribution/user.contribution.controller");

const router = express.Router();

router.post("/send-email", userController.sendEmail);
router.post("/verify-pin", userController.verifyPin);
router.post(
  "/submit",
  upload.single("user_image_link"),
  (req, res, next) => {
    next();
  },
  userController.submit
);
router.post("/check-duplicate-nickname", userController.verifyNickname);

router.use("/profile", profileRouter);
router.use("/watchlist", watchlistRouter);

// 트위터 OAuth 2.0 인증 시작
router.post("/twitter/auth", userContributionController.twitterOAuth);

// 트위터 OAuth 2.0 콜백 처리 (Access Token 요청)
router.get("/twitter/callback", userContributionController.getAccessToken);

// Access Token을 사용한 API 호출
router.get(
  "/twitter/user",
  userContributionController.makeAuthenticatedRequest
);

module.exports = router;
