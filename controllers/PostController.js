const mongoose = require("mongoose");
const Post = require("../models/PostModel");
const User = require("../models/UserModel");
const moment = require("moment");

const create_post = async (req, res) => {
  try {
    const { title: typed_title, description: typed_description } = req.body;
    const user_id = req.id;
    if (!typed_title) {
      return res.status(400).send({
        status: 0,
        message: "please enter title",
      });
    } else if (!typed_description) {
      return res.status(400).send({
        status: 0,
        message: "please enter description",
      });
    }
    const user = await User.findOne({ _id: user_id });
    if (!user) {
      return res.status(400).send({
        status: 0,
        message: "user not found",
      });
    }
    const image_path = req?.file?.path?.replace(/\\/g, "/");
    const post = await Post.create({
      title: typed_title,
      description: typed_description,
      image: image_path,
      post_date: moment(Date.now()).format("MMMM Do YYYY, h:mm:ss a"),
      post_author: user_id,
    });
    res.status(200).send({
      status: 1,
      message: "post successfully created",
      post: post,
    });
  } catch (err) {
    console.error("Error", err.message);
    res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const get_post = async (req, res) => {
  try {
    const user_id = req.id;
    const post_id = req.query.post_id;
    const user = await User.findOne({ _id: user_id });
    if (!user) {
      return res.status(400).send({
        status: 0,
        message: "user not found",
      });
    } else if (!mongoose.isValidObjectId(post_id)) {
      return res.status(400).send({
        status: 0,
        message: "not a valid post ID",
      });
    }
    const post = await Post.findOne({ _id: post_id });
    if (post) {
      return res.status(200).send({
        status: 1,
        message: "post successfully fetched",
        post: post,
      });
    } else {
      return res.status(400).send({
        status: 0,
        message: "post not found",
      });
    }
  } catch (err) {
    console.error("Error", err.message);
    res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const edit_post = async (req, res) => {
  try {
    const { title: typed_title, description: typed_description } = req.body;
    const user_id = req.id;
    const post_id = req.query.post_id;
    if (!typed_title) {
      return res.status(400).send({
        status: 0,
        message: "please enter title",
      });
    } else if (!typed_description) {
      return res.status(400).send({
        status: 0,
        message: "please enter description",
      });
    }
    const user = await User.findOne({ _id: user_id });
    if (!user) {
      return res.status(400).send({
        status: 0,
        message: "user not found",
      });
    } else if (!mongoose.isValidObjectId(post_id)) {
      return res.status(400).send({
        status: 0,
        message: "not a valid post ID",
      });
    }
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(400).send({
        status: 0,
        message: "post not found",
      });
    }
    const image_path = req?.file?.path?.replace(/\\/g, "/");
    const edited_post = await Post.findOneAndUpdate(
      { _id: post_id },
      { title: typed_title, description: typed_description, image: image_path },
      { new: true }
    );
    res.status(200).send({
      status: 1,
      message: "post edited successfully",
      post: edited_post,
    });
  } catch (err) {
    console.error("Error", err.message);
    res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const delete_post = async (req, res) => {
  try {
    const user_id = req.id;
    const post_id = req.query.post_id;
    const user = await User.findOne({ _id: user_id });
    if (!user) {
      return res.status(400).send({
        status: 0,
        message: "user not found",
      });
    } else if (!mongoose.isValidObjectId(post_id)) {
      return res.status(400).send({
        status: 0,
        message: "not a valid post ID",
      });
    }
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(400).send({
        status: 0,
        message: "post not found",
      });
    }
    const post_deleted = await Post.findOneAndUpdate(
      { _id: post_id },
      {
        is_delete: true,
        delete_date: moment(Date.now()).format("MMMM Do YYYY, h:mm:ss a"),
      },
      { new: true }
    );
    res.status(200).send({
      status: 1,
      message: "post deleted successfully",
    });
  } catch (err) {
    console.error("Error", err.message);
    res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const get_user_posts = async (req, res) => {
  try {
    const user_id = req.id;
    const user = await User.findOne({ _id: user_id });
    if (!user) {
      return res.status(400).send({
        status: 0,
        message: "user not found",
      });
    }
    const user_email = user?.email;
    // const posts=await Post.find({post_author:user_id});
    //getting user's post with user's data
    const posts = await Post.aggregate([
      {
        $match: {
          post_author: new mongoose.Types.ObjectId(user_id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "post_author",
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
        $project: {
          title: 1,
          description: 1,
          image: 1,
          post_date: 1,
          is_delete: 1,
          delete_date: 1,
          is_block: 1,
          block_date: 1,
          post_edited: 1,
          post_edited_date: 1,
          "result._id": 1,
          "result.name": 1,
          "result.email": 1,
          "result.image": 1,
          "result.role": 1,
        },
      },
    ]);
    if (posts) {
      res.status(200).send({
        status: 0,
        message: `got all ${user_email} posts`,
        posts: posts,
      });
    } else {
      res.status(200).send({
        status: 0,
        message: "No posts found for the user",
      });
    }
  } catch (err) {
    console.error("Error", err.message);
    res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const get_all_posts = async (req, res) => {
  try {
    const user_id = req.id;
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(400).send({
        status: 0,
        message: "user not found",
      });
    }
    // const posts=await Post.find({});
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "post_author",
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
        $addFields: {
          my_post: {
            $cond: {
              if: {
                $eq: ["$result._id", new mongoose.Types.ObjectId(user_id)],
              },
              then: 1,
              else: 0,
            },
          },
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          image: 1,
          post_date: 1,
          is_delete: 1,
          delete_date: 1,
          is_block: 1,
          block_date: 1,
          post_edited: 1,
          post_edited_date: 1,
          my_post:1,
          "result._id": 1,
          "result.name": 1,
          "result.email": 1,
          "result.image": 1,
          "result.role": 1,
        },
      },
    ]);
    if (posts) {
      res.status(200).send({
        status: 0,
        message: "got all user's posts",
        posts: posts,
      });
    } else {
      res.status(200).send({
        status: 0,
        message: "No posts found",
      });
    }
  } catch (err) {
    console.error("Error", err.message);
    res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  create_post,
  edit_post,
  get_post,
  delete_post,
  get_user_posts,
  get_all_posts,
};
