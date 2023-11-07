const Message = require("../models/MessageModel");
const mongoose = require("mongoose");
const User = require("../models/UserModel");

const get_chat_messages = async (req, res) => {
  try {
    const user_id = req?.id;
    const contact_id = req?.query?.contact_id;
    if (!contact_id) {
      return res.status(500).send({
        status: 0,
        message: "please enter contact ID",
      });
    } else if (!mongoose.isValidObjectId(contact_id)) {
      return res.status(500).send({
        status: 0,
        message: "Not valid user ID",
      });
    }
    const user = await User.findById(contact_id);
    if (!user) {
      return res.status(500).send({
        status: 0,
        message: "user not found",
      });
    }
    const chat_messages = await Message.find({
        $or: [
          {
            sender_id: new mongoose.Types.ObjectId(user_id),
            receiver_id: new mongoose.Types.ObjectId(contact_id),
          },
          {
            sender_id:  new mongoose.Types.ObjectId(contact_id),
            receiver_id:  new mongoose.Types.ObjectId(user_id),
          },
        ],
      //   sender_id: new mongoose.Types.ObjectId(user_id),
      //   receiver_id: new mongoose.Types.ObjectId(contact_id),
    });
    return res.status(200).send({
      status: 1,
      message: "fetched all chat messages",
      chat_messages,
    });
  } catch (err) {
    console.error("Error", err.message.red);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  get_chat_messages,
};
