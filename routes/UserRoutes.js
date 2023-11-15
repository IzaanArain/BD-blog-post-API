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
const { post_reaction,get_post_reactions, post_reaction_count } = require("../controllers/ReactionController");
const { post_comment, edit_comment, delete_comment, get_post_comments } = require("../controllers/CommentController");
const { report_post,all_reported_post } = require("../controllers/ReportPostController");
const { favourite_post, get_favourite_posts } = require("../controllers/FavouritePostController");
const { get_chat_messages } = require("../controllers/ChatController");
const { get_all_users } = require("../controllers/AdminController");

const router = express.Router();
// user routes
router.post("/register", register);
router.post("/otp_verify", otp_verify);
router.post("/login", login);
router.post("/forgot_password", forgot_password);
router.post("/reset_password", reset_password);

router.post("/complete_profile",user_validate_token, upload.single("profile_image"), complete_profile);
router.put("/edit_profile", user_validate_token, upload.single("profile_image"), edit_profile);
router.put("/change_password", user_validate_token, change_password);
router.delete("/delete_profile", user_validate_token, delete_profile);
// post routes
router.post("/create_post", user_validate_token, upload.single("post_image"), create_post);
router.put("/edit_post",user_validate_token, upload.single("post_image"), edit_post);
router.get("/get_post",user_validate_token, get_post);
router.delete("/delete_post",user_validate_token, delete_post);
router.get("/get_user_posts",user_validate_token, get_user_posts);
router.get("/get_all_posts",user_validate_token, get_all_posts);
// post reaction
router.post("/post_reaction",user_validate_token,post_reaction);
router.get("/all_reactions",user_validate_token,get_post_reactions);
router.get("/reactions_count",user_validate_token,post_reaction_count);
// post comment
router.post("/post_comment",user_validate_token,post_comment);
router.put("/edit_comment",user_validate_token,edit_comment);
router.delete("/delete_comment",user_validate_token,delete_comment);
router.get("/all_post_comments",user_validate_token,get_post_comments);
//report post
router.post("/report_post",user_validate_token,report_post);
router.get("/all_reported_post",user_validate_token,all_reported_post);
// favourite post
router.post("/favourite_post",user_validate_token,favourite_post);
router.get("/get_favourite_posts",user_validate_token,get_favourite_posts);
// chat routes
router.get("/chat_messages",user_validate_token,get_chat_messages);
// GET users
router.get("/all_users",user_validate_token,get_all_users)
module.exports = router;
