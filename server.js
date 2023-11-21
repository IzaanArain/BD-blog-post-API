const express = require("express");
require("dotenv").config();
const Connect = require("./config/DBConnection");
const colors = require("colors");
const UserRoutes = require("./routes/UserRoutes");
const AdminRoutes = require("./routes/AdminRoutes");
const http = require("http");
const cors = require("cors");
// const Message = require("./models/MessageModel");
// const User = require("./models/UserModel");
// const moment = require("moment");
// const mongoose = require("mongoose");
const socket=require("./utils/Socket")
const app = express();
app.use(cors());
const server = http.createServer(app);
const { Server } = require("socket.io");
const { requstDetails } = require("./middleware/RequestDetails");
const io = new Server(server,{
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});
socket(io);
app.use(express.json());                              
app.use(express.urlencoded({ extended: false }));
app.use(requstDetails)
app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/admin", AdminRoutes);
app.use("/public", express.static("public"));

Connect().then(() => {
  PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}/api/v1/user`);
    console.log(`Server Running on PORT ${PORT}`);
  });
});
