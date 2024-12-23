const express = require("express");
const {
  playVsComputer,
  playVsPlayer,
  getLeaderboardData,
} = require("../controllers/matchController");
const verifyJWT = require("../middleware/verifyJWT");
const router = express.Router();

router.post("/play/player", verifyJWT, playVsPlayer);
router.get("/leaderboard", verifyJWT, getLeaderboardData);
router.post("/play/computer", verifyJWT, playVsComputer);

module.exports = router;
