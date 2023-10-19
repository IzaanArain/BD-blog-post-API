const moment = require("moment");
const User = require("../models/UserModel");
const Post = require("../models/PostModel");
const Reaction = require("../models/PostReactionModel");
const mongoose = require("mongoose");

const post_reaction = async (req, res) => {
  try {
    const user_id = req.id;
    const post_id = req.query.post_id;
    const post_reaction = req.body.reaction;
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(500).send({
        status: 0,
        message: "user not found",
      });
    }
    const user_email = user?.email;
    if (!mongoose.isValidObjectId(post_id)) {
      return res.status(500).send({
        status: 0,
        message: "not valid post ID",
      });
    }
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(500).send({
        status: 0,
        message: "post not found",
      });
    }
    const reaction_exits = await Reaction.findOne({
      user_id: user_id,
      post_id: post_id,
    });
    const reaction_id = reaction_exits?._id;
    if (reaction_exits) {
      if (!post_reaction) {
        const reaction = await Reaction.findOneAndUpdate(
          { _id: reaction_id },
          {
            reaction_type: "no_reaction",
            reaction_date: moment(Date.now()).format("MMMM Do YYYY, h:mm:ss a"),
          },
          { new: true }
        );
        const reaction_type = reaction?.reaction_type;
        return res.status(200).send({
          status: 1,
          message: `${user_email} has ${reaction_type} post`,
        });
      } else {
        const reaction = await Reaction.findOneAndUpdate(
          { _id: reaction_id },
          {
            reaction_type: post_reaction,
            reaction_date: moment(Date.now()).format("MMMM Do YYYY, h:mm:ss a"),
          },
          { new: true }
        );
        const reaction_type = reaction?.reaction_type;
        return res.status(200).send({
          status: 1,
          message: `${user_email} has ${reaction_type} post`,
        });
      }
    } else {
      const reaction = await Reaction.create({
        user_id: user_id,
        post_id: post_id,
        reaction_type: post_reaction,
        reaction_date: moment(Date.now()).format("MMMM Do YYYY, h:mm:ss a"),
      });
      const reaction_type = reaction?.reaction_type;
      return res.status(200).send({
        status: 1,
        message: `${user_email} has ${reaction_type} post`,
      });
    }
  } catch (err) {
    console.error("Error", err.message);
    res.status(500).send({
      status: 0,
      message: "something went wronge",
    });
  }
};

const get_post_reactions = async (req, res) => {
  try {
    const user_id = req.id;
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
        message: "not a valid ID",
      });
    }
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(500).send({
        status: 0,
        message: "post not found",
      });
    }

    // const reactions = await Reaction.aggregate([
    //   {
    //     $match: {
    //       post_id: new mongoose.Types.ObjectId(post_id),
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "user_id",
    //       foreignField: "_id",
    //       as: "result",
    //     },
    //   },
    //   {
    //     $unset: [
    //       "result.password",
    //       "result.phone",
    //       "result.role",
    //       "result.otp_code",
    //       "result.user_auth",
    //       "result.is_verified",
    //       "result.is_notification",
    //       "result.is_delete",
    //       "result.is_blocked",
    //       "result.is_complete",
    //       "result.is_forgot_password",
    //       "result.device_token",
    //       "result.device_type",
    //       "result.social_token",
    //       "result.social_type",
    //     ],
    //   },
    //   {
    //     $unwind: {
    //       path: "$result",
    //     },
    //   },
    // ]);

    // const reactions = await Reaction.aggregate([
    //   {
    //     $match: {
    //       post_id: new mongoose.Types.ObjectId(post_id),
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "user_id",
    //       foreignField: "_id",
    //       as: "result",
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$result",
    //     },
    //   },
    //   {
    //     $project: {
    //       reaction_type: 1,
    //       "result.name": 1,
    //     },
    //   },
    // ]);

    // const reactions = await Reaction.aggregate([
    //   {
    //     $match: {
    //       post_id: new mongoose.Types.ObjectId(post_id),
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "user_id",
    //       foreignField: "_id",
    //       as: "result",
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$result",
    //     },
    //   },
    //   {
    //     $addFields: {
    //       user_name: "$result.name",
    //       reactions: "reaction_type",
    //     },
    //   },
    //   {
    //     $project: {
    //       reactions: 1,
    //       user_name: 1,
    //     },
    //   },
    // ]);

    // const reactions = await Reaction.aggregate([
    //   {
    //     $match: {
    //       post_id: new mongoose.Types.ObjectId(post_id),
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "user_id",
    //       foreignField: "_id",
    //       as: "result",
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$result",
    //     },
    //   },
    //   {
    //     $addFields: {
    //       my_reaction: {
    //         $cond: {
    //           if: {
    //             $eq: ["$result._id", new mongoose.Types.ObjectId(user_id)],
    //           },
    //           then: "$reaction_type",
    //           else: null,
    //         },
    //       },
    //     },
    //   },
    //   {
    //         $unset: [
    //           "result.password",
    //           "result.phone",
    //           "result.role",
    //           "result.otp_code",
    //           "result.user_auth",
    //           "result.is_verified",
    //           "result.is_notification",
    //           "result.is_delete",
    //           "result.is_blocked",
    //           "result.is_complete",
    //           "result.is_forgot_password",
    //           "result.device_token",
    //           "result.device_type",
    //           "result.social_token",
    //           "result.social_type",
    //         ],
    //       },
    // ]);

    const reactions = await Reaction.aggregate([
      {
        $match: {
          post_id: new mongoose.Types.ObjectId(post_id),
        },
      },
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
        $addFields: {
          user_email: "$result.email",
          post_title: "$post.title",
          my_reaction: {
            $cond: {
              if: {
                $eq: ["$result._id", new mongoose.Types.ObjectId(user_id)],
              },
              then: "$reaction_type",
              else: null,
            },
          },
        },
      },
      {
        $unset: ["result", "post"],
      },
    ]);
    
    res.status(200).send({
      status: 1,
      message: "got all reactions!",
      reactions: reactions,
    });
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "something went wronge",
    });
  }
};

const get_reaction_count = async (req, res) => {
  try {
    const user_id = req.id;
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
        message: "not a valid ID",
      });
    }
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(500).send({
        status: 0,
        message: "post not found",
      });
    }
   
    const reactions_count=await Reaction.aggregate([
      
    ])
    return res.status(200).send({
      status: 1,
      message: "got all reactions!",
      reactions_count
    });
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "something went wronge",
    });
  }
};

module.exports = {
  post_reaction,
  get_post_reactions,
  get_reaction_count,
};
