const playerService = require('../services/playerService');

async function addPlayer(req, res) {
  const { username } = req.body;
  const player = await playerService.addPlayer(username);
  res.json(player);
}

module.exports = { addPlayer };
