const express = require("express");
const router = express.Router();
const upload = require("../../../../utils/multer"); // multer 설정 파일 임포트
const {
  getProfile,
  updateProfile,
  updateXP,
  updatePointHistory,
  getUserPointHistory,
  updateXPBalance,
  getUserDealInterest,
  checkAlreadyClaimed,
  getProjectParticipants,
} = require("./profile.controller"); // 컨트롤러 임포트

// 프로필 정보 가져오기 라우터
router.get("/:walletAddress", getProfile);

// 프로필 업데이트 라우터
router.put("/:walletAddress", upload.single("profileImage"), updateProfile);

// XP 포인트 트랜잭션 라우터 (project_id를 함께 전송)
router.post("/update-xp", updateXP);

// 새로운 XP 잔액 업데이트 라우터 추가
router.post("/update-xp-balance", updateXPBalance); // XP 잔액 업데이트

// Point History 업데이트 라우터 (project_id를 함께 전송)
router.post("/update-history", updatePointHistory);

// Point History 조회 라우터
router.get("/get-history/:walletAddress", getUserPointHistory);

router.post("/get-user-interest", getUserDealInterest);

router.post("/check-already-claimed", checkAlreadyClaimed);

router.get("/:pjtId/participants", getProjectParticipants);

module.exports = router;
