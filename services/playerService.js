const playerRepository = require('../repositories/playerRepository');
const PlayerDTO = require('../dto/playerDto');

async function addPlayer(username) {
  await playerRepository.addPlayer(username);
  return new PlayerDTO(username);
}

module.exports = { addPlayer };
