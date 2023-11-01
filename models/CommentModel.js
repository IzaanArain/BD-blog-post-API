const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    comment_text: {
      type: String,
      default: "",
    },
    post_id: {
      type: mongoose.Schema.ObjectId,
      ref: "post",
      default:null
    },
    comment_author: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      default:null
    },
    comment_date: {
      type: String,
      default: "",
    },
    is_delete:{
      type: Boolean,
      default: false,
    },
    delete_date:{
      type: String,
      default: "",
    },
    is_block: {
      type: Boolean,
      default: false,
    },
    block_date:{
      type: String,
      default: "",
    },
    comment_edited: {
      type: Boolean,
      default: false,
    },
    comment_edited_date: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("comment", commentSchema);
