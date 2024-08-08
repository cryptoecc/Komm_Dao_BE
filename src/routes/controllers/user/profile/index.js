const express = require("express");
const router = express.Router();
const upload = require("../../../../utils/multer"); // multer 설정 파일 임포트
const { getProfile, updateProfile } = require("./profile.controller"); // 컨트롤러 임포트

// 프로필 정보 가져오기 라우터
router.get("/:walletAddress", getProfile);

// 프로필 업데이트 라우터
router.put("/:walletAddress", upload.single("profileImage"), updateProfile);

module.exports = router;
