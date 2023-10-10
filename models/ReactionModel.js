const mongoose = require("mongoose");
const { Schema } = mongoose;

const reactionSchema = new Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
  },
  post_id: {
    type: mongoose.Schema.ObjectId,
    ref: "post",
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

module.exports = mongoose.model("reaction", reactionSchema);
