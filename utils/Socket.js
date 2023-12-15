const Message = require("../models/MessageModel");
const User = require("../models/UserModel");
const moment = require("moment");
const mongoose = require("mongoose");

const socket = async (io) => {
  try {

    io.on("connection", (socket) => {
      console.log("A user connected", socket.id);

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
          const room = `room${[sender_id, receiver_id].sort().join("")}`;
          socket.join(room);
          const chat_messages = await Message.find({
            $or: [
              {
                sender_id:sender_id,
                receiver_id:receiver_id,
              },
              {
                sender_id:receiver_id,
                receiver_id:sender_id,
              },
            ],
            //   sender_id: new mongoose.Types.ObjectId(sender_id),
            //   receiver_id: new mongoose.Types.ObjectId(receiver_id),
          });
          // console.log(chat_messages.length);
          if (chat_messages.length > 0) {
            io.to(room).emit("get_all_messages", chat_messages);
          } else {
            io.to(room).emit("get_all_messages", []);
          }
        } catch (err) {
          // console.error("Error", err.message);
          socket.emit("error_message", err.message);
        }
      });

      socket.on("send_message", async (data) => {
        try {
          const { sender_id, receiver_id, message: typed_message } = data;
          // console.log({ sender_id, receiver_id, message: typed_message })
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
          // const room = `room${sender_id}${receiver_id}`;
          const room = `room${[sender_id, receiver_id].sort().join("")}`;
          // socket.join(room);
          // console.log("sender", room);
          // console.log("room created",socket.rooms);
          const message = new Message({
            sender_id: sender_id,
            receiver_id: receiver_id,
            message: typed_message,
            time: moment(Date.now()).format("MMMM Do YYYY, h:mm:ss a"),
          });
          const new_message = await message.save();
          // console.log("message created",new_message)
          // socket.to(room).emit("receive_message", new_message);
          io.to(room).emit("receive_message", new_message);
        } catch (err) {
          console.error("Error", err.message);
          socket.emit("error_message", err.message);
        }
      });

      socket.on("receive_message", async (data) => {
        try {
          const { sender_id, receiver_id, message: typed_message } = data;

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
          // const room = `room${receiver_id}${sender_id}`;
          const room = `room${[sender_id, receiver_id].sort().join("")}`;
          // socket.join(room);
          // console.log("receiver", room);
          // console.log("room created",socket.rooms);
          const message = new Message({
            sender_id: sender_id,
            receiver_id: receiver_id,
            message: typed_message,
            time: moment(Date.now()).format("MMMM Do YYYY, h:mm:ss a"),
          });
          const new_message = await message.save();
          socket.to(room).emit("send_message", new_message);
          // io.to(room).emit("send_message", new_message);
        } catch (err) {
          // console.error("Error", err.message);
          socket.emit("error_message", err.message);
        }
      });

      // socket.on("messages",(data)=>{
      //   // socket.join(data.room)
      //   socket.join(data.room)
      //   console.log("room",socket.rooms)
      //   // socket.emit("messages", "testing.....");
      //   io.to(data.room).emit("messages", "testing.....");
      // });

      socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
      });
    });
  } catch (err) {
    console.error("Error", err.message);
  }
};

module.exports=socket;