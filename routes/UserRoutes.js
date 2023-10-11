const express = require("express");
const {
  register,
  otp_verify,
  login,
  complete_profile,
  forgot_password,
  reset_password,
} = require("../controllers/UserController");
const router = express.Router();

router.post("/register", register);
router.post("/otp_verify", otp_verify);
router.post("/login", login);
router.post("/complete_profile", complete_profile);
router.post("/forgot_password", forgot_password);
router.post("/reset_password", reset_password);

module.exports = router;
