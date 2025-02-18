const express = require("express");
const router = express.Router();

const { create, login, logout, authenticateToken } = require("../controllers/userController");

router.post("/create",authenticateToken, create);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
