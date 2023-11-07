const express = require("express");
require("dotenv").config();
const Connect = require("./config/DBConnection");
const colors = require("colors");
const UserRoutes = require("./routes/UserRoutes");
const AdminRoutes = require("./routes/AdminRoutes");
const http = require("http");
const cors = require("cors");
const Message = require("./models/MessageModel");
const User=require("./models/UserModel")
const moment = require("moment");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/admin", AdminRoutes);
app.use("/public", express.static("public"));

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on("get_all_messages", async (data) => {
    try {
      const { sender_id, receiver_id } = data;
      if (!sender_id) {
        throw new Error("please enter sender_id");
      }else if (!receiver_id) {
        throw new Error("please receiver_id");
      }else if(!mongoose.isValidObjectId(sender_id)){
        throw new Error("Invalid sender_id");
      }else if(!mongoose.isValidObjectId(receiver_id)){
        throw new Error("Invalid receiver_id");
      }
      const sender=await User.findById(sender_id);
      if(!sender){
        throw new Error("sender not found");
      };
      const receiver=await User.findById(receiver_id);
      if(!receiver){
        throw new Error("receiver not found");
      };
      const room = `room${sender_id}${receiver_id}`;
      socket.join(room);
      console.log("get_all_messages : ", room);
      const chat_messages = await Message.find({
        $or: [
          {
            sender_id: new mongoose.Types.ObjectId(sender_id),
            receiver_id: new mongoose.Types.ObjectId(receiver_id),
          },
          {
            sender_id: new mongoose.Types.ObjectId(receiver_id),
            receiver_id: new mongoose.Types.ObjectId(sender_id),
          },
        ],
        //   sender_id: new mongoose.Types.ObjectId(sender_id),
        //   receiver_id: new mongoose.Types.ObjectId(receiver_id),
      });
      // console.log(chat_messages);
      //socket.emit("get_all_messages", chat_messages);
      // socket.to(room).emit("get_all_messages", chat_messages);

      if (chat_messages.length > 0) {
        socket.to(room).emit("get_all_messages", chat_messages);
      } else {
        // Handle the case when no messages are found
        socket.emit("get_all_messages", []);
      }
    } catch (err) {
      console.error("Error", err.message);
      socket.emit("error_message", err.message);
    }
  });

  socket.on("send_message", async (data) => {
    try {
      const { sender_id, receiver_id, message: typed_message } = data;
      if (!sender_id) {
        throw new Error("please enter sender_id");
      }else if (!receiver_id) {
        throw new Error("please receiver_id");
      }else if(!mongoose.isValidObjectId(sender_id)){
        throw new Error("Invalid sender_id");
      }else if(!mongoose.isValidObjectId(receiver_id)){
        throw new Error("Invalid receiver_id");
      }
      const sender=await User.findById(sender_id);
      if(!sender){
        throw new Error("sender not found");
      };
      const receiver=await User.findById(receiver_id);
      if(!receiver){
        throw new Error("receiver not found");
      };
      const room = `room${sender_id}${receiver_id}`;
      // socket.join(room);
      console.log("sender", room);
      const message = new Message({
        sender_id: sender_id,
        receiver_id: receiver_id,
        message: typed_message,
        room: room,
        time: moment(Date.now()).format("MMMM Do YYYY, h:mm:ss a"),
      });
      const new_message = await message.save();
      // console.log(new_message)
      socket.to(room).emit("receive_message", new_message);
    } catch(err) {
      console.error("Error", err.message);
      socket.emit("error_message", err.message);
    }
  });

  socket.on("receive_message", async (data) => {
    try {
      const { sender_id, receiver_id, message: typed_message } = data;
      if (!sender_id) {
        throw new Error("please enter sender_id");
      }else if (!receiver_id) {
        throw new Error("please receiver_id");
      }else if(!mongoose.isValidObjectId(sender_id)){
        throw new Error("Invalid sender_id");
      }else if(!mongoose.isValidObjectId(receiver_id)){
        throw new Error("Invalid receiver_id");
      }
      const sender=await User.findById(sender_id);
      if(!sender){
        throw new Error("sender not found");
      };
      const receiver=await User.findById(receiver_id);
      if(!receiver){
        throw new Error("receiver not found");
      };
      const room = `room${receiver_id}${sender_id}`;
      // socket.join(room);
      console.log("receiver", room);
      const message = new Message({
        sender_id: sender_id,
        receiver_id: receiver_id,
        message: typed_message,
        room: room,
        time: moment(Date.now()).format("MMMM Do YYYY, h:mm:ss a"),
      });
      const new_message = await message.save();
      socket.to(room).emit("send_message", new_message);
    } catch(err) {
      console.error("Error", err.message);
      socket.emit("error_message", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });

});

Connect().then(() => {
  PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}/api/v1/user`);
    console.log(`Server Running on PORT ${PORT}`);
  });
});
