const User = require("../models/UserModel");
const CryptoJS = require("crypto-js");
const { create_token } = require("../middleware/Auth");

const register = async (req, res) => {
  try {
    const { email: typed_email, password: typed_password,role } = req.body;
    const roles=["user","admin"]
    if (!typed_email) {
      return res.status(400).send({
        status: 0,
        message: "please enter email",
      });
    } else if (
      !typed_email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    ) {
      return res.status(400).send({
        status: 0,
        message: "please enter valid email",
      });
    } else if (!typed_password) {
      return res.status(400).send({
        status: 0,
        message: "please enter password",
      });
    } else if (
      !typed_password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      return res.status(400).send({
        status: 0,
        message:
          "Password should include at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character.",
      });
    }else if(!role){
      return res.status(400).send({
        status: 0,
        message: "please select a role",
      });
    } 
    const user_role=role.toLowerCase()
    if(!roles.includes(user_role)){
      return res.status(400).send({
        status: 0,
        message: "role can either user or admin",
      });
    }
    const userExists = await User.findOne({ email: typed_email });
    if (userExists) {
      return res.status(400).send({
        status: 0,
        message: "user is already registered",
      });
    }
    const encrypted_password = CryptoJS.AES.encrypt(
      typed_password,
      process.env.SECRET_KEY
    ).toString();
    const gen_otp_code = Math.floor(Math.random() * 900000) + 100000;

    const user = await User.create({
      email: typed_email,
      password: encrypted_password,
      role:user_role,
      otp_code: gen_otp_code,
    });

    const email = user?.email;
    if (user) {
      res.status(200).send({
        status: 1,
        message: "user registered succesfully",
        email: email,
      });
    } else {
      res.status(200).send({
        status: 1,
        message: "Failed to register user",
      });
    }
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",

    });
  }
};

const otp_verify = async (req, res) => {
  try {
    const { email: typed_email, otp_code: typed_otp_code } = req.body;
    if (!typed_email) {
      return res.status(400).send({
        status: 0,
        message: "please enter email",
      });
    } else if (
      !typed_email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    ) {
      return res.status(400).send({
        status: 0,
        message: "please enter valid email",
      });
    } else if (!typed_otp_code) {
      return res.status(400).send({
        status: 0,
        message: "please enter OTP code",
      });
    } else if (typed_otp_code.length !== 6) {
      return res.status(400).send({
        status: 0,
        message: "OTP code must be of six digits",
      });
    } else if (!typed_otp_code.match(/^[0-9]*$/)) {
      return res.status(400).send({
        status: 0,
        message: "OTP code consists of numbers only",
      });
    }

    const user = await User.findOne({ email: typed_email });
    if (!user) {
      return res.status(400).send({
        status: 0,
        message: "user not found,try again",
      });
    }
    const user_otp_code = user?.otp_code;
    if (parseInt(typed_otp_code) !== user_otp_code) {
      return res.status(200).send({
        status: 0,
        message: "OTP does not match",
      });
    }

    const user_verfied = await User.findOneAndUpdate(
      { email: typed_email },
      { is_verified: true },
      { new: true }
    );
    const { email, is_verified, is_forgot_password } = user_verfied;
    if (is_forgot_password) {
      res.status(200).send({
        status: 1,
        message: "OTP successfully verified",
        email,
        is_verified,
        is_forgot_password,
      });
    } else {
      res.status(200).send({
        status: 1,
        message: "OTP successfully verified",
        email,
        is_verified,
      });
    }
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email: typed_email, password: typed_password } = req.body;
    if (!typed_email) {
      return res.status(400).send({
        status: 0,
        message: "please enter email",
      });
    } else if (
      !typed_email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    ) {
      return res.status(400).send({
        status: 0,
        message: "please enter valid email",
      });
    } else if (!typed_password) {
      return res.status(400).send({
        status: 0,
        message: "please enter password",
      });
    } else if (
      !typed_password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      return res.status(400).send({
        status: 0,
        message:
          "Password should include at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character.",
      });
    }
    const user = await User.findOne({ email: typed_email });
    if (!user) {
      return res.status(400).send({
        status: 0,
        message: "user does not exist",
      });
    }
    const userVerified = user?.is_verified;
    if (!userVerified) {
      return res.status(400).send({
        status: 0,
        message: "user is not verified",
      });
    }
    const isBlocked = user?.is_blocked;
    if (isBlocked) {
      return res.status(400).send({
        status: 0,
        message: "you are blocked please contact admin for further details",
      });
    }
    const deleted = user?.is_delete;
    if (deleted) {
      return res.status(400).send({
        status: 0,
        message: "you are deleted please contact admin for further details",
      });
    }
    const encrypted_password = user?.password;
    const decrypt_password = CryptoJS.AES.decrypt(
      encrypted_password,
      process.env.SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);

    if (typed_password === decrypt_password) {
      const user_id = user?._id;
      const token = create_token(user_id);
      const save_user_token = await User.findOneAndUpdate(
        { _id: user_id },
        { user_auth: token },
        { new: true }
      );

      res.status(200).send({
        status: 1,
        message: "logged in successfully",
        data: save_user_token,
      });
    } else {
      return res.status(400).send({
        status: 0,
        message: "Incorrect password",
      });
    }
  } catch (err) {
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const forgot_password = async (req, res) => {
  try {
    const typed_email = req.body.email;
    if (!typed_email) {
      return res.status(400).send({
        status: 0,
        message: "please enter email",
      });
    } else if (
      !typed_email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    ) {
      return res.status(400).send({
        status: 0,
        message: "please enter valid email",
      });
    }
    const userExists = await User.findOne({ email: typed_email });
    if (!userExists) {
      return res.status(404).send({
        status: 0,
        message: "user not found",
      });
    }

    const gen_otp_code = Math.floor(Math.random() * 900000) + 100000;

    const user = await User.findOneAndUpdate(
      { email: typed_email },
      { otp_code: gen_otp_code, is_verified: false, is_forgot_password: true },
      { new: true }
    );
    const { email, is_verified, is_forgot_password, otp_code } = user;
    res.status(200).send({
      status: 1,
      message: "forgot password successfully",
      email,
      otp_code,
      is_verified,
      is_forgot_password,
    });
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const reset_password = async (req, res) => {
  try {
    const { email: typed_email, password: typed_password } = req.body;
    if (!typed_email) {
      return res.status(400).send({
        status: 0,
        message: "please enter email",
      });
    } else if (
      !typed_email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    ) {
      return res.status(400).send({
        status: 0,
        message: "please enter valid email",
      });
    } else if (!typed_password) {
      return res.status(400).send({
        status: 0,
        message: "please enter password",
      });
    } else if (
      !typed_password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      return res.status(400).send({
        status: 0,
        message:
          "Password should include at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character.",
      });
    }
    const user = await User.findOne({ email: typed_email });
    if (!user) {
      return res.status(404).send({
        status: 0,
        message: "user not found",
      });
    }
    const userVerified = user?.is_verified;
    if (!userVerified) {
      return res.status(400).send({
        status: 0,
        message: "user is not verified",
      });
    }
    const is_forgot_password = user?.is_forgot_password;
    if (is_forgot_password) {
      const user_id = user?._id;
      const encrypted_password = CryptoJS.AES.encrypt(
        typed_password,
        process.env.SECRET_KEY
      ).toString();
      const user_updated = await User.findOneAndUpdate(
        { _id: user_id },
        { password: encrypted_password, is_forgot_password: false },
        { new: true }
      );

      res.status(200).send({
        status: 1,
        message: "successfully reset password",
      });
    } else {
      return res.status(400).send({
        status: 0,
        message: "reset password failed, please try again",
      });
    }
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
      error: err.message,
    });
  }
};

const complete_profile = async (req, res) => {
  try {
    const user_id = req?.id;
    const { name, phone } = req.body;
    if (!name) {
      return res.status(400).send({
        status: 0,
        message: "please enter name",
      });
    } else if (!phone) {
      return res.status(400).send({
        status: 0,
        message: "please enter phone number",
      });
    } else if (
      !phone.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
    ) {
      return res.status(400).send({
        status: 0,
        message: "please enter valid phone number",
      });
    } else if (phone.length !== 11) {
      return res.status(400).send({
        status: 0,
        message: "phone number must consist of 11 digits",
      });
    }
    const user = await User.findOne({ _id: user_id });
    if (!user) {
      return res.status(404).send({
        status: 0,
        message: "user not found",
      });
    }
    const image_path = req?.file?.path?.replace(/\\/g, "/");
    const user_completed = await User.findByIdAndUpdate(
      { _id: user_id },
      { name: name, phone: phone, image: image_path, is_complete: true },
      { new: true }
    );
    res.status(200).send({
      status: 1,
      message: "User profile completed successfully",
      user: user_completed,
    });
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const edit_profile = async (req, res) => {
  try {
    const user_id = req?.id;
    const { name, phone } = req.body;
    if (!name) {
      return res.status(400).send({
        status: 0,
        message: "please enter name",
      });
    } else if (!phone) {
      return res.status(400).send({
        status: 0,
        message: "please enter phone number",
      });
    } else if (
      !phone.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
    ) {
      return res.status(400).send({
        status: 0,
        message: "please enter valid phone number",
      });
    } else if (phone.length !== 11) {
      return res.status(400).send({
        status: 0,
        message: "phone number must consist of 11 digits",
      });
    }
    const user = await User.findOne({ _id: user_id });
    if (!user) {
      return res.status(404).send({
        status: 0,
        message: "user not found",
      });
    }
    const image_path = req?.file?.path?.replace(/\\/g, "/");
    const user_updated = await User.findByIdAndUpdate(
      { _id: user_id },
      { name: name, phone: phone, image: image_path },
      { new: true }
    );
    res.status(200).send({
      status: 1,
      message: "User profile successfully updated",
      user: user_updated,
    });
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const change_password = async (req, res) => {
  try {
    const user_id = req.id;
    const typed_password = req.body.password;
    if (!typed_password) {
      return res.status(400).send({
        status: 0,
        message: "please enter password",
      });
    } else if (
      !typed_password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      return res.status(400).send({
        status: 0,
        message:
          "Password should include at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character.",
      });
    }
    const user = await User.findOne({ _id: user_id });
    if (!user) {
      return res.status(400).send({
        status: 0,
        message: "user does not exist",
      });
    }
    const encrypted_password = CryptoJS.AES.encrypt(
      typed_password,
      process.env.SECRET_KEY
    ).toString();
    const user_updated = await User.findByIdAndUpdate(
      { _id: user_id },
      { password: encrypted_password },
      { new: true }
    );
    res.status(200).send({
      status: 1,
      message: "password changed successfully",
      user: user_updated,
    });
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const delete_profile = async (req, res) => {
  try {
    const user_id=req.id;
    const user = await User.findOne({ _id: user_id,role:"user"});
    if (!user) {
      return res.status(400).send({
        status: 0,
        message: "user not found",
      });
    }
    const user_delete=await User.findOneAndUpdate(
      {_id:user_id,role:"user"},
      {is_delete:true},
      {new:true}
    );
    const is_delete=user_delete.is_delete;
    res.status(200).send({
      status:0,
      message:"User deleted successfully",
      is_delete:is_delete
    })
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  register,
  otp_verify,
  login,
  complete_profile,
  forgot_password,
  reset_password,
  edit_profile,
  change_password,
  delete_profile
};
