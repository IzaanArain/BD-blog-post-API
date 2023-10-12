const express = require("express");
const {
  register,
  otp_verify,
  login,
  complete_profile,
  forgot_password,
  reset_password,
} = require("../controllers/UserController");
const { user_validate_token } = require("../middleware/Auth");
const files=require("../middleware/Multer");
const router = express.Router();

router.post("/register", register);
router.post("/otp_verify", otp_verify);
router.post("/login", login);
router.post("/forgot_password", forgot_password);
router.post("/reset_password", reset_password);
router.post("/complete_profile", user_validate_token,files.upload, complete_profile);

module.exports = router;
