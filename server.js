const express = require("express");
require("dotenv").config();
const Connect = require("./config/DBConnection");
const colors = require("colors");
const UserRoutes=require("./routes/UserRoutes")

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use("/api/v1/user",UserRoutes)

PORT = process.env.PORT || 3000;
Connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}/api/v1/user`);
    console.log(`Server Running on PORT ${PORT}`);
  });
});
