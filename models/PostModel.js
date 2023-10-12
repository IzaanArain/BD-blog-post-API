const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    post_date: {
      type: String,
      default: "",
    },
    post_author: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    is_delete:{
      type: Boolean,
      default: false,
    },
    is_block: {
      type: Boolean,
      default: false,
    },
    post_edited: {
      type: Boolean,
      default: false,
    },
    post_edited_date: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("post", postSchema);
