const express = require("express");
const { user_validate_token } = require("../middleware/Auth");
const { admin_delete_user, admin_block_user,get_all_users } = require("../controllers/AdminController");

const router = express.Router();

router.delete("/admin_delete_user",user_validate_token,admin_delete_user);
router.post("/admin_block_user",user_validate_token,admin_block_user);
router.get("/users", user_validate_token, get_all_users);

module.exports = router;