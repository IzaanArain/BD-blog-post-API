const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref:"user"
    },
    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref:"user"
    },
    message:{
        type:String,
        default:""
    },
    group_id:{
      type:String,
      default:""
    },
    time:{
        type:String,
        default:""
    }
  },
  {
    timestamps: true,
  }
);

module.exports=mongoose.model("message",messageSchema);
