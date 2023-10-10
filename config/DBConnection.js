const mongoose = require("mongoose");

const Connect = async () => {
  try {
    const conn = await mongoose.connect(process.env.CONNECTION_STRING);
    const state = conn.connection.readyState;
    if (state === 1) {
      console.log(
        `database connected at : ${conn.connection.host}/${conn.connection.name} Successfully`
          .cyan
      );
    } else if (state === 2) {
      console.log(`database connecting please wait .....`);
    } else if (state === 3) {
      console.log(`database disconnecting please wait .....`);
    }
  } catch (err) {
    console.error("Error",err.message);
    process.exit(1)
  }
};

module.exports = Connect;
