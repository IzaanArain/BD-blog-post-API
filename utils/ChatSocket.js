const Message = require("../models/MessageModel");
const User = require("../models/UserModel");
const moment = require("moment");
const mongoose = require("mongoose");

const socket = async (io) => {
  try {
    io.on("connection", (socket) => {
      console.log("user connected", socket.id);

      socket.on("get_all_messages", async (data) => {
        try {
          const { sender_id, receiver_id } = data;
          if (!sender_id || !receiver_id) {
            throw new Error("Please provide both sender_id and receiver_id.");
          } else if (
            !mongoose.isValidObjectId(sender_id) ||
            !mongoose.isValidObjectId(receiver_id)
          ) {
            throw new Error("Invalid sender_id or receiver_id.");
          }
          const [sender, receiver] = await Promise.all([
            User.findById(sender_id),
            User.findById(receiver_id),
          ]);
          if (!sender) {
            throw new Error("Sender not found.");
          } else if (!receiver) {
            throw new Error("Receiver not found.");
          }
          const room = `room_${sender_id}`;
          socket.join(room);
          const chat_messages = await Message.find({
            $or: [
              {
                sender_id: sender_id,
                receiver_id: receiver_id,
              },
              {
                sender_id: receiver_id,
                receiver_id: sender_id,
              },
            ],
          })
            .populate("sender_id receiver_id", "name image")
            // .sort({ createdAt: -1 });
          if (chat_messages.length > 0) {
            io.to(room).emit("response", {
              object_type: "get_all__messages",
              data: chat_messages,
            });
          } else {
            io.to(room).emit("response", {
              object_type: "get_all__messages",
              data: [],
            });
          }
        } catch (err) {
          console.error("Error", err.message);
          // socket.emit("error_message", err.message);
          io.emit("error", {
            object_type: "get_all_messages",
            message: err.message,
          });
        }
      });

      socket.on("send_message", async (data) => {
        const { sender_id, receiver_id, message: typed_message } = data;
        const sender_room = `room_${sender_id}`;
        const receiver_room = `room_${receiver_id}`;
        try {
          if (!sender_id) {
            throw new Error("please enter sender_id");
          } else if (!receiver_id) {
            throw new Error("please receiver_id");
          } else if (!mongoose.isValidObjectId(sender_id)) {
            throw new Error("Invalid sender_id");
          } else if (!mongoose.isValidObjectId(receiver_id)) {
            throw new Error("Invalid receiver_id");
          }
          const sender = await User.findById(sender_id);
          if (!sender) {
            throw new Error("sender not found");
          }
          const receiver = await User.findById(receiver_id);
          if (!receiver) {
            throw new Error("receiver not found");
          }
          // const chat_messages = await Message.find({
          //   $or: [
          //     {
          //       sender_id: sender_id,
          //       receiver_id: receiver_id,
          //     },
          //     {
          //       sender_id: receiver_id,
          //       receiver_id: sender_id,
          //     },
          //   ],
          // })
          const message = new Message({
            sender_id: sender_id,
            receiver_id: receiver_id,
            message: typed_message,
            time: moment(Date.now()).format("MMMM Do YYYY, h:mm:ss a"),
          });
          await message.save();
          const new_message = await message.populate(
            "sender_id receiver_id",
            "name image"
          );
          // socket.to(room).emit("receive_message", new_message);
          io.to(sender_room).to(receiver_room).emit("response", {
            object_type: "get_message",
            data: new_message,
          });
        } catch (err) {
          console.error("Error", err.message);
          // socket.emit("error_message", err.message);
          io.to(sender_room).to(receiver_room).emit("error", {
            object_type: "get_message",
            message: err.message,
          });
        }
      });

      socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
      });
    });
  } catch (err) {
    console.error("Error", err.message);
  }
};

module.exports = socket;
