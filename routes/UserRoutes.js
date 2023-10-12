const express = require("express");
const {
  register,
  otp_verify,
  login,
  forgot_password,
  reset_password,
  complete_profile,
  edit_profile,
  change_password,
  delete_profile
} = require("../controllers/UserController");
const { user_validate_token } = require("../middleware/Auth");
const files=require("../middleware/Multer");
const router = express.Router();

router.post("/register", register);
router.post("/otp_verify", otp_verify);
router.post("/login", login);
router.post("/forgot_password", forgot_password);
router.post("/reset_password", reset_password);
router.post("/complete_profile", user_validate_token, files.upload, complete_profile);
router.put("/edit_profile", user_validate_token, files.upload,edit_profile);
router.put("/change_password", user_validate_token, files.upload, change_password);
router.delete("/delete_profile", user_validate_token, delete_profile)

module.exports = router;
