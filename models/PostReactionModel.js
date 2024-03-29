const mongoose = require("mongoose");
const { Schema } = mongoose;

const postReactionSchema = new Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    default:null,
  },
  post_id: {
    type: mongoose.Schema.ObjectId,
    ref: "post",
    default:null
  },
  reaction_type: {
    type: String,
    enum: ["like", "dislike","heart","no_reaction"],
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

module.exports = mongoose.model("reaction", postReactionSchema);
