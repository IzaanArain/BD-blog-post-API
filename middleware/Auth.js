const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const create_token = (id) => {
  return jwt.sign({ id: id }, process.env.SECRET_TOKEN);
};

const user_validate_token = (req, res, next) => {
  try {
    const token=req?.headers?.authorization?.split(" ")[1];
    if(!token){
        res.status(500).send({
            status: 0,
            Message: "token is required",
          });
    }
    
    console.log("token: ",token)
    next()
  } catch (err) {
    console.log("Error", err.message);
    res.status(500).send({
      status: 0,
      Message: "Authentication failed",
    });
  }
};

module.exports = {
  create_token,
  user_validate_token,
};
