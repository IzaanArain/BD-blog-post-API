const User = require("../models/UserModel");
const Post = require("../models/PostModel");
const Comment = require("../models/CommentModel");
const mongoose = require("mongoose");
const moment=require("moment");

const post_comment = async (req, res) => {
  try {
    const user_id = req.id;
    const comment_text = req.body.comment_text;
    const post_id = req.query.post_id;
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(500).send({
        status: 0,
        message: "user not found",
      });
    }
    if (!mongoose.isValidObjectId(post_id)) {
      return res.status(500).send({
        status: 0,
        message: "Not a valid post ID",
      });
    }
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(500).send({
        status: 0,
        message: "post not found",
      });
    }else if(!comment_text){
        return res.status(500).send({
            status: 0,
            message: "enter comment text",
          });
    }
    const comment = await Comment.create({
      comment_text: comment_text,
      post_id: post_id,
      comment_author: user_id,
      comment_date: moment(Date.now()).format("MMMM Do YYYY, h:mm:ss a"),
    });

    return res.status(200).send({
      status: 0,
      message: "comment created successfully",
      comment: comment,
    });
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "something went wronge",
      error: err.message,
    });
  }
};

const edit_comment = async (req, res) => {
  try {
    const user_id = req.id;
    const comment_id = req.query.comment_id;
    const comment_text = req.body.comment_text;
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(500).send({
        status: 0,
        message: "user not found",
      });
    }
    if (!mongoose.isValidObjectId(comment_id)) {
      return res.status(500).send({
        status: 0,
        message: "Not a valid comment ID",
      });
    }
    const comment = await Comment.findById(comment_id);
    if (!comment) {
      return res.status(500).send({
        status: 0,
        message: "comment not found",
      });
    }
    const comment_updated = await Comment.findOneAndUpdate(
      { _id: comment_id },
      {
        comment_text: comment_text,
        comment_edited: true,
        comment_edited_date: moment(Date.now()).format(
          "MMMM Do YYYY, h:mm:ss a"
        ),
      },
      { new: true }
    );
    return res.status(200).send({
      status: 0,
      message: "comment edited successfully",
      comment: comment_updated,
    });
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "something went wronge",
    });
  }
};

const delete_comment = async (req, res) => {
  try {
    const user_id = req.id;
    const comment_id = req.query.comment_id;
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(500).send({
        status: 0,
        message: "user not found",
      });
    }
    if (!mongoose.isValidObjectId(comment_id)) {
      return res.status(500).send({
        status: 0,
        message: "Not a valid comment ID",
      });
    }
    const comment = await Comment.findById(comment_id);
    if (!comment) {
      return res.status(500).send({
        status: 0,
        message: "comment not found",
      });
    }
    const comment_deleted = await Comment.findOneAndUpdate(
      { _id: comment_id },
      {
        is_delete: true,
        delete_date: moment(Date.now()).format("MMMM Do YYYY, h:mm:ss a"),
      },
      { new: true }
    );
    return res.status(200).send({
      status: 0,
      message: "comment deleted successfully",
    });
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "something went wronge",
    });
  }
};

const get_post_comments = async (req, res) => {
  try {
    const user_id=req.id;
    const post_id=req.query.post_id;
    const user=await User.findById(user_id);
    if(user){
        return res.status(500).send({
          status: 0,
          message: "user not found",
        });
    }else if(mongoose.isValidObjectId(post_id)){
        return res.status(500).send({
            status: 0,
            message: "not valid post ID",
          });
    };
    const post =await Post.findById(post_id)
    if(!post){
        return res.status(500).send({
            status: 0,
            message: "post not found",
          });
    };

    const comments=await Comment.find({post_id:post_id});
    
    return res.status(200).send({
        status:0,
        message:"got all post comments",
        comments:comments
    })
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "something went wronge",
    });
  }
};

module.exports = {
  post_comment,
  edit_comment,
  delete_comment,
  get_post_comments,
};
