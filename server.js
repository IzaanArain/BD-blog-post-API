const express = require("express");
require("dotenv").config();
const Connect = require("./config/DBConnection");
const colors = require("colors");
const UserRoutes=require("./routes/UserRoutes")
const AdminRoutes=require("./routes/AdminRoutes");
const http=require("http");
const cors=require("cors");
const Message=require("./models/MessageModel");
const moment=require("moment");

const app = express();
app.use(cors());
const server=http.createServer(app)
const {Server}=require("socket.io");
const io=new Server(server);

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use("/api/v1/user",UserRoutes);
app.use("/api/v1/admin",AdminRoutes);
app.use("/public",express.static("public"));

io.on("connection",(socket)=>{
  console.log("user connected",socket.id);

  socket.on("send_message",async(data)=>{
   try{
    const {sender_id,receiver_id,message:typed_message}=data;
    const room=`room${sender_id}${sender_id}`;

      const message=new Message({
        sender_id:sender_id,
        receiver_id:receiver_id,
        message:typed_message,
        room:room,
        time:moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a')
      })
      const new_message=await message.save()
      socket.to(room).emit("receive_message",new_message);
   }catch{
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
   }
  })
})
Connect().then(() => {
  PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}/api/v1/user`);
    console.log(`Server Running on PORT ${PORT}`);
  });
});
