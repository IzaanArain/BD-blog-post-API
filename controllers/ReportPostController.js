const mongoose = require("mongoose");
const User = require("../models/UserModel");
const Post = require("../models/PostModel");
const ReportPost = require("../models/ReportPostModel");
const moment = require("moment");

const report_post = async (req, res) => {
  try {
    const user_id = req.id;
    const post_id = req.body.post_id;
    const reported_text = req.body.text;
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(400).send({
        status: 0,
        message: "user not found",
      });
    } else if (!mongoose.isValidObjectId(post_id)) {
      return res.status(400).send({
        status: 0,
        message: "not valid post ID",
      });
    }
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(400).send({
        status: 0,
        message: "post not found",
      });
    } else if (!reported_text) {
      return res.status(400).send({
        status: 0,
        message: "please enter text",
      });
    }
    const report_post_exists = await ReportPost.findOne({
      user_id: user_id,
      post_id: post_id,
    });
    const report_post_id = report_post_exists?._id;
    const is_reported = report_post_exists?.is_reported;

    if (report_post_exists) {
      if (is_reported) {
        const report_post = await ReportPost.findByIdAndUpdate(
          report_post_id,
          {
            reported_text: "",
            is_reported: false,
          },
          { new: true }
        );
        const is_rep = report_post?.is_reported;
        return res.status(200).send({
          status: 1,
          message: "report cancelled",
          is_reported: is_rep,
        });
      } else {
        const report_post = await ReportPost.findByIdAndUpdate(
          report_post_id,
          {
            reported_text: reported_text,
            is_reported: true,
            reported_date: moment(Date.now()).format("MMMM Do YYYY, h:mm:ss a"),
          },
          { new: true }
        );
        return res.status(200).send({
          status: 1,
          message: "post reported successfully",
          reported_post: report_post,
        });
      }
    } else {
      const report_post = await ReportPost.create({
        user_id: user_id,
        post_id: post_id,
        reported_text: reported_text,
        is_reported: true,
        reported_date: moment(Date.now()).format("MMMM Do YYYY, h:mm:ss a"),
      });

      return res.status(200).send({
        status: 1,
        message: "post reported successfully",
        reported_post: report_post,
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

const all_reported_post = async (req, res) => {
    try {
      const admin_id = req.id;
      const admin = await User.findOne({ _id: admin_id, role: "admin" });
      if (!admin) {
        return res.status(500).send({
          status: 0,
          message: "admin not found",
        });
      }
      const show_report = await ReportPost.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "result",
          },
        },
        {
          $unwind: {
            path: "$result",
          },
        },
        {
          $lookup: {
            from: "posts",
            localField: "post_id",
            foreignField: "_id",
            as: "post",
          },
        },
        {
          $unwind: {
            path: "$post",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "post.post_author",
            foreignField: "_id",
            as: "post_author",
          },
        },
        {
          $unwind: {
            path: "$post_author",
          },
        },
        {
          $addFields: {
            reporter_email: "$result.email",
            post_author_email: "$post_author.email",
            post_author_id: "$post_author._id",
            post_title: "$post.title",
            post_description: "$post.description",
            post_image: "$post.image",
          },
        },
        {
          $unset: ["result", "post", "post_author"],
        },
      ]);
      // const show_report=await ReportPost.find().populate("user_id","name")
      return res.status(200).send({
        status: 1,
        message: "got reported post",
        reported_posts: show_report,
      });
    } catch (err) {
      console.error("Error", err.message);
      return res.status(500).send({
        status: 0,
        message: "Something went wrong",
        error: err.message,
      });
    }
  };
  
module.exports = {
  report_post,
  all_reported_post
};
