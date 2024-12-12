const jwt = require('jsonwebtoken');

function generateAccessToken(username) {
    return jwt.sign(username, "secret", { expiresIn: '1800s' });
  }

module.exports = { generateAccessToken }