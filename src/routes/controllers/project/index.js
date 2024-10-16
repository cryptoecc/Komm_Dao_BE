const express = require("express");
const { updateProjectRating } = require("./project.controller");
const router = express.Router();

// 별점 업데이트 라우트
router.post("/update-rating", updateProjectRating);

module.exports = router;
