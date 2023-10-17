const mongoose = require("mongoose");
const { Schema } = mongoose;

const reportPostSchema = new Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    post_id: {
      type: mongoose.Types.ObjectId,
      ref: "post",
    },
    reported_text: {
      type: String,
      default: "",
    },
    is_reported: {
      type: Boolean,
      default: false,
    },
    reported_date:{
      type:String,
      default:""
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("report", reportPostSchema);
