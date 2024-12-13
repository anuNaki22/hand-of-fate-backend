//mendaftarkan endpoint 
const express = require("express");
const router = express.Router();

const userController = require("../controllers/users.controllers");
const authenticateToken = require("../middlewares/auth.middleware");

router.post("/users", userController.createUser);
router.get("/profile", authenticateToken, userController.getUserById);
router.post("/login", userController.login);

//transaction
router.get("/transaction", userController.transaction);
// router.get("/historytransaction". userController.historytransaction);

module.exports = router;