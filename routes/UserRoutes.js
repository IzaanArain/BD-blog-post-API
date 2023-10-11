const express = require("express");
const {
  register,
  otp_verify,
  login,
} = require("../controllers/UserController");
const router = express.Router();

router.post("/register", register);
router.post("/otp_verify", otp_verify);
router.post("/login", login);
module.exports = router;
