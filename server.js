const express = require("express");
require("dotenv").config();
const Connect = require("./config/DBConnection");
const colors = require("colors");
const app = express();

PORT = process.env.PORT || 3000;

Connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}/`);
    console.log(`Server Running on PORT ${PORT}`);
  });
});
