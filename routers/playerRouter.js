const express = require('express');
const playerController = require('../controllers/playerController');

const router = express.Router();

router.post('/join', playerController.addPlayer);

module.exports = { router };
