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
    },
    comment_author: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
    comment_date: {
      type: String,
      default: "",
    },
    is_block: {
      type: Boolean,
      default: false,
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
