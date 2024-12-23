const { saveMatch, updateUserPoints } = require("../models/matchModel");

const playAgainstComputer = async (req, res) => {
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
      const match = await saveMatch(userId, "computer", finalResult);

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

module.exports = { playAgainstComputer };
