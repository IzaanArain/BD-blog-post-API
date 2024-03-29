const mongoose = require("mongoose");
const User = require("../models/UserModel");
const Post = require("../models/PostModel");
const FavouritePost = require("../models/FavouritePostModel");
const moment = require("moment");

const favourite_post = async (req, res) => {
  try {
    const user_id = req.id;
    const post_id = req.query.post_id;
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
    }
    const favourite_post_exists = await FavouritePost.findOne({
      user_id: user_id,
      post_id: post_id,
    });
    const favourite_post_id = favourite_post_exists?._id;
    const is_favourite = favourite_post_exists?.is_favourite;

    if (favourite_post_exists) {
      if (is_favourite) {
        const favourite_post = await FavouritePost.findByIdAndUpdate(
          favourite_post_id,
          { is_favourite: false },
          { new: true }
        );
        const is_fav = favourite_post?.is_favourite;
        return res.status(200).send({
          status: 1,
          message: "unfavourite unsuccessfully",
          is_favourite: is_fav,
        });
      } else {
        const favourite_post = await FavouritePost.findByIdAndUpdate(
          favourite_post_id,
          { is_favourite: true },
          { new: true }
        );
        const is_fav = favourite_post?.is_favourite;
        return res.status(200).send({
          status: 1,
          message: "post successfully added in favorites",
          is_favourite: is_fav,
          favourite_date: moment(Date.now()).format("MMMM Do YYYY, h:mm:ss a"),
        });
      }
    } else {
      const favourite_post = await FavouritePost.create({
        user_id: user_id,
        post_id: post_id,
        is_favourite: true,
        favourite_date: moment(Date.now()).format("MMMM Do YYYY, h:mm:ss a"),
      });
      return res.status(200).send({
        status: 1,
        message: "post successfully added in favorites",
        favourite_post: favourite_post,
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

const get_favourite_posts = async (req, res) => {
  try {
    const user_id = req.id;
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(500).send({
        status: 0,
        message: "user not found",
      });
    }
    const show_favourites = await FavouritePost.aggregate([
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(user_id),
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
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
        },
      },
      {
        $addFields: {
          post_title: "$post.title",
          post_description: "$post.description",
          post_image: "$post.image",
          user_email: "$user.email",
          user_name: "$user.name",
          user_image: "$user.image",
        },
      },
      {
        $unset: ["user", "post"],
      },
    ]);
    return res.status(200).send({
      status: 0,
      message: "got all favourite post",
      posts: show_favourites,
    });
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  favourite_post,
  get_favourite_posts,
};
