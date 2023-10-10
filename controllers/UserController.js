const User = require("../models/UserModel");

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).send({
        status: 0,
        message: "please enter email",
      });
    } else if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      return res.status(400).send({
        status: 0,
        message: "please enter valid email",
      });
    } else if (!password) {
      return res.status(400).send({
        status: 0,
        message: "please enter password",
      });
    } else if (
      !password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      return res.status(400).send({
        status: 0,
        message: "please enter valid password",
      });
    }
  } catch (err) {
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
      error: err.message,
    });
  }
};

module.exports = {
  register,
};
