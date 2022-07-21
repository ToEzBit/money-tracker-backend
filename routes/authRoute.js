const express = require("express");
const authController = require("../controllers/authController");
const userPassportJwt = require("../middlewares/userPassportJwt");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", userPassportJwt, authController.getMe);

module.exports = router;
