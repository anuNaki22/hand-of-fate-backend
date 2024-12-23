const {
  saveMatch,
  updateUserPoints,
  getLeaderboard,
} = require("../models/matchModel");

const playVsComputer = async (req, res) => {
  const { userId, userChoice, rounds = [] } = req.body;

  const validChoices = ["rock", "paper", "scissors"];
  if (!validChoices.includes(userChoice))
    return res.status(400).json({ message: "Invalid choice" });

  const computerChoice =
    validChoices[Math.floor(Math.random() * validChoices.length)];
  let winner;

  // Tentukan pemenang untuk ronde ini
  if (userChoice === computerChoice) {
    winner = "draw";
  } else if (
    (userChoice === "rock" && computerChoice === "scissors") ||
    (userChoice === "scissors" && computerChoice === "paper") ||
    (userChoice === "paper" && computerChoice === "rock")
  ) {
    winner = "user1"; // User menang
  } else {
    winner = "computer"; // Komputer menang
  }

  // Tambahkan ronde ke array rounds
  const newRound = { userChoice, computerChoice, winner };
  const updatedRounds = [...rounds, newRound];

  // Hitung total kemenangan user dan komputer
  const userWins = updatedRounds.filter(
    (round) => round.winner === "user1"
  ).length;
  const computerWins = updatedRounds.filter(
    (round) => round.winner === "computer"
  ).length;

  // Tentukan hasil akhir (jika selesai Bo5)
  let finalResult = null;
  if (userWins === 3 || computerWins === 3 || updatedRounds.length === 5) {
    finalResult =
      userWins > computerWins
        ? "user1"
        : userWins < computerWins
        ? "computer"
        : "draw";

    try {
      // Simpan pertandingan ke database
      const match = await saveMatch(userId, null, finalResult); // null = computer

      // Update leaderboard
      if (finalResult === "user1") {
        await updateUserPoints(userId, 3); // Menang vs komputer: +3 poin
      } else if (finalResult === "draw") {
        await updateUserPoints(userId, 1); // Seri vs komputer: +1 poin
      }

      return res.status(200).json({
        message: "Game over",
        finalResult,
        rounds: updatedRounds,
        match,
      });
    } catch (error) {
      console.error("Error recording match:", error);
      return res.status(500).json({ message: "Error recording match", error });
    }
  }

  // Kirimkan status permainan sementara jika belum selesai
  res.status(200).json({
    message: "Round completed",
    rounds: updatedRounds,
    userWins,
    computerWins,
  });
};

const playVsPlayer = async (req, res) => {
  let { user1Id, user2Id, rounds } = req.body;

  // Validasi bahwa ini adalah pertandingan PvP
  if (!user1Id || !user2Id || user2Id === "computer") {
    return res.status(400).json({
      message: "This endpoint is for recording PvP matches only.",
    });
  }

  // Validasi jumlah ronde untuk Bo5
  if (rounds.length < 3 || rounds.length > 5) {
    return res.status(400).json({
      message: "Invalid number of rounds. Bo5 requires between 3 to 5 rounds.",
    });
  }

  if (!Array.isArray(rounds)) {
    return res.status(400).json({
      message: "Invalid input data format.",
    });
  }

  if (
    !rounds.every(
      (round) =>
        round.winner === "user1" ||
        round.winner === "user2" ||
        round.winner === "draw"
    )
  ) {
    return res.status(400).json({
      message:
        "Each round must have a valid winner ('user1', 'user2', or 'draw').",
    });
  }

  try {
    let user1Wins = 0;
    let user2Wins = 0;
    let winner = null;

    for (let i = 0; i < rounds.length; i++) {
      if (rounds[i].winner === "user1") user1Wins++;
      if (rounds[i].winner === "user2") user2Wins++;

      // Periksa jika ada pemenang (mencapai 3 kemenangan)
      if (user1Wins === 3 || user2Wins === 3) {
        winner = user1Wins === 3 ? "user1" : "user2";
        break;
      }
    }

    // Jika tidak ada pemenang meskipun semua ronde dimainkan
    if (!winner) {
      winner =
        user1Wins > user2Wins
          ? "user1"
          : user1Wins < user2Wins
          ? "user2"
          : "draw";
    }

    // Simpan pertandingan ke database
    const match = await saveMatch(user1Id, user2Id, winner);

    // Update leaderboard
    if (winner === "user1") {
      await updateUserPoints(user1Id, 3);
    } else if (winner === "user2") {
      await updateUserPoints(user2Id, 3);
    } else if (winner === "draw") {
      await updateUserPoints(user1Id, 1);
      await updateUserPoints(user2Id, 1);
    }

    res.status(201).json({
      message: "Match recorded successfully",
      match,
    });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ message: "Error recording match", error });
  }
};

const getLeaderboardData = async (req, res) => {
  try {
    const leaderboard = await getLeaderboard();
    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaderboard", error });
  }
};

module.exports = { playVsComputer, playVsPlayer, getLeaderboardData };
