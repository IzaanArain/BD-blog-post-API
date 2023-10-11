const jwt=require("jsonwebtoken");
const User=require("../models/UserModel");

const create_token=(id)=>{
    return jwt.sign({id:id},process.env.SECRET_TOKEN);
}


module.exports={
    create_token
}