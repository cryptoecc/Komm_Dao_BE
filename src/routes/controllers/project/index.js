const express = require("express");
const { getProjectDetails } = require("./project.controller");
const router = express.Router();

// 프로젝트 세부 정보 가져오기 라우트
router.get("/:pjt_id/details", getProjectDetails);

module.exports = router;
