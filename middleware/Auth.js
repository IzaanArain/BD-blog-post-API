const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const create_token = (id) => {
  return jwt.sign({ id: id }, process.env.SECRET_TOKEN);
};

const user_validate_token = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      res.status(500).send({
        status: 0,
        Message: "token is required",
      });
    }
    const auth = await User.findOne({ user_auth: token });
    if (!auth) {
      res.status(404).send({
        status: 0,
        Message: "Not a valid token",
      });
    } else if (auth.is_blocked) {
      res.status(404).send({
        status: 0,
        Message: `${auth.email} is blocked, please contact admin`,
      });
    } else {
      const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
      req.id = decoded.id;
      next();
    }
  } catch (err) {
    console.log("Error", err);
    res.status(500).send({
      status: 0,
      Message: "Authentication failed",
      Error: err,
    });
  }
};

module.exports = {
  create_token,
  user_validate_token,
};
