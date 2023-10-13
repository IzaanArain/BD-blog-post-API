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
  delete_profile,
} = require("../controllers/UserController");
const { user_validate_token } = require("../middleware/Auth");
const {upload} = require("../middleware/Multer");
const {
  create_post,
  edit_post,
  get_post,
  delete_post,
  get_user_posts,
  get_all_posts
} = require("../controllers/PostController");

const router = express.Router();

router.post("/register", register);
router.post("/otp_verify", otp_verify);
router.post("/login", login);
router.post("/forgot_password", forgot_password);
router.post("/reset_password", reset_password);
router.post("/complete_profile",user_validate_token, upload.single("profile_image"), complete_profile);
router.put("/edit_profile", user_validate_token, upload.single("profile_image"), edit_profile);
router.put("/change_password", user_validate_token, change_password);
router.delete("/delete_profile", user_validate_token, delete_profile);
//post routes
router.post("/create_post", user_validate_token, upload.single("post_image"), create_post);
router.put("/get_post",user_validate_token, upload.single("post_image"), edit_post);
router.get("/get_post",user_validate_token, get_post);
router.delete("/delete_post",user_validate_token, delete_post)
router.get("/get_user_posts",user_validate_token, get_user_posts);
router.get("/get_all_posts",user_validate_token, get_all_posts)

module.exports = router;
