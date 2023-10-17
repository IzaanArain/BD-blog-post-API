const mongoose = require("mongoose");
const { Schema } = mongoose;

const favouritePostSchema = new Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    post_id: {
      type: mongoose.Types.ObjectId,
      ref: "post",
    },
    is_favourite: {
      type: Boolean,
      default: false,
    },
    favourite_date:{
      type:String,
      default:""
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("favourite", favouritePostSchema);
