const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentReactionSchema = new Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
  },
  comment_id: {
    type: mongoose.Schema.ObjectId,
    ref: "comment",
  },
  reaction_type: {
    type: String,
    enum: ["like", "dislike"],
    default: "",
  },
  reaction_date: {
    type: String,
    default: "",
  },
},
{
    timestamps:true
});

module.exports = mongoose.model("reaction", commentReactionSchema);
