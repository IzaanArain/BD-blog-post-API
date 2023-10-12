const User = require("../models/UserModel");
const mongoose = require("mongoose");

const admin_delete_user = async (req, res) => {
  try {
    const admin_id = req.id;
    const user_id = req.query.user_id;
    const admin = await User.findOne({ _id: admin_id, role: "admin" });
    if (!admin) {
      return res.status(400).send({
        status: 0,
        message: "you are not admin",
      });
    }
    if (!mongoose.isValidObjectId(user_id)) {
      return res.status(400).send({
        status: 0,
        message: "Not a valid user ID",
      });
    }
    const user = await User.findOne({ _id: user_id, role: "user" });
    if (!user) {
      return res.status(400).send({
        status: 0,
        message: "User not found",
      });
    }
    const del = user?.is_delete;
    const user_delete = await User.findOneAndUpdate(
      { _id: user_id, role: "user" },
      { is_delete: !del },
      { new: true }
    );
    const is_delete = user_delete.is_delete;

    if (is_delete) {
      res.status(200).send({
        status: 1,
        message: "User deleted successfully",
        is_delete: is_delete,
      });
    } else {
      return res.status(400).send({
        status: 1,
        message: "User delete failed",
        is_delete: is_delete,
      });
    }
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};
const admin_block_user = async (req, res) => {
  try {
    const admin_id = req.id;
    const user_id = req.query.user_id;
    const admin = await User.findOne({ _id: admin_id, role: "admin" });
    if (!admin) {
      return res.status(400).send({
        status: 0,
        message: "you are not admin",
      });
    }
    if (!mongoose.isValidObjectId(user_id)) {
      return res.status(400).send({
        status: 0,
        message: "Not a valid user ID",
      });
    }
    const user = await User.findOne({ _id: user_id, role: "user" });
    if (!user) {
      return res.status(400).send({
        status: 0,
        message: "User not found",
      });
    }
    const block = user?.is_blocked;
    const user_blocked = await User.findOneAndUpdate(
      { _id: user_id, role: "user" },
      { is_blocked: !block },
      { new: true }
    );
    const is_blocked = user_blocked?.is_blocked;
    const user_email = user_blocked?.email;
    if (is_blocked) {
      res.status(200).send({
        status: 1,
        message: `User ${user_email} is blocked`,
        is_blocked: is_blocked,
      });
    } else {
      res.status(200).send({
        status: 1,
        message: `User ${user_email} is unblocked`,
        is_blocked: is_blocked,
      });
    }
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};
const get_all_users = async (req, res) => {
  try {
    const admin_id = req.id;
    const admin = await User.findOne({ _id: admin_id, role: "admin" });

    if (admin) {
      const users = await User.find({}).sort({ createdAt: -1 });
      res.status(200).send({
        status: 1,
        message: "fetched all users successfully",
        users: users,
      });
    } else {
      return res.status(400).send({
        status: 0,
        message: "you are not admin",
      });
    }
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  admin_delete_user,
  admin_block_user,
  get_all_users,
};
