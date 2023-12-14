const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

// generating a token
const create_token = (id) => {
  return jwt.sign({ id: id }, process.env.SECRET_TOKEN);
};

// validating the token
const user_validate_token = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1] || req?.headers?.["Authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(500).send({
        status: 0,
        message: "token is required",
      });
    }
    const auth = await User.findOne({ user_auth: token });
    if (!auth) {
      return res.status(404).send({
        status: 0,
        message: "Not a valid token",
      });
    } else if (auth.is_blocked) {
      return res.status(404).send({
        status: 0,
        message: `${auth.email} is blocked, please contact admin`,
      });
    } else {
      const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
      req.id = decoded.id;
      next();
    }
  } catch (err) {
    console.log("Error", err);
   return res.status(500).send({
      status: 0,
      message: "Authentication failed",
      Error: err,
    });
  }
};

module.exports = {
  create_token,
  user_validate_token,
};
