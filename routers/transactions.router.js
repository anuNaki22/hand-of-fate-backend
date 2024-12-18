const express = require("express");
const router = express.Router();

const transactionController = require("../controllers/transactions.controllers");
const authenticateToken = require("../middlewares/auth.middleware");

router.post("/transactions/transfer", authenticateToken, transactionController.transfer);
router.post("/transactions/topup", authenticateToken,  transactionController.topUp);
router.get("/transactions", authenticateToken,  transactionController.getAllTransactions);

module.exports = router;