const express = require("express");
const router = express.Router();
const watchlistController = require("./watchlist.controller");

// 유저의 Watchlist에 프로젝트 추가
router.post("/add", watchlistController.addToWatchlist);

// 유저의 Watchlist에서 프로젝트 삭제
router.delete("/remove", watchlistController.removeFromWatchlist);

// 유저의 Watchlist 조회
router.get("/:user_id", watchlistController.getUserWatchlist);

module.exports = router;
