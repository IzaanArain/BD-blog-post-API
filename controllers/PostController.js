const Post = require("../models/PostModel");
const User = require("../models/UserModel");

const create_post = async (req, res) => {
  try {
    const { title: typed_title, description: typed_description } = req.body;
    const user_id = req.id;
    if(!typed_title){
        return res.status(400).send({
            status: 0,
            message: "please enter title",
          });
    }else if (!typed_description){
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
const edit_post = async (req, res) => {
  try {
    const { title: typed_title, description: typed_description } = req.body;
    const user_id = req.id;
    const post_id=req.query.post_id;
    if(!typed_title){
        return res.status(400).send({
            status: 0,
            message: "please enter title",
          });
    }else if (!typed_description){
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
    // const edited_post=await Post.findOneAndUpdate({_id:post_id})
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
};
