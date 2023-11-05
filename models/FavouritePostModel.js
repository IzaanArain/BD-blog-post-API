const mongoose = require("mongoose");
const { Schema } = mongoose;

const favouritePostSchema = new Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      default:null
    },
    post_id: {
      type: mongoose.Types.ObjectId,
      ref: "post",
      default:null
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
