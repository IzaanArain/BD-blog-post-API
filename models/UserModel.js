const mongoose=require("mongoose");
const {Schema}=mongoose

const userSchema=new Schema({
    email:{
        type:String,
        default:"",
        required:[true,"please enter email"],
        unique:true,
        lowercase:true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    password:{
        type:String,
        default:"",
        required:[true,"please enter email"],
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Please fill a valid password'],
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user",
        require:[true,"role is required"]
    },
    name:{
        type:String,
        default:""
    },
    phone:{
        type:String,
        default:"",
        match:[/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,'Please fill a valid phone number']
    },
    image:{
        type:String,
        default:""
    },
    otp_code:{
        type:Number,
        default:""
    },
    is_verified:{
        type:Boolean,
        default:false
    },
    user_auth:{
        type:String,
        default:""
    },
    is_complete:{
        type:Boolean,
        default:false
    },
    is_notification:{
        type:Boolean,
        default:false
    },
    is_forgot_password:{
        type:Boolean,
        default:false
    },
    is_blocked:{
        type:Boolean,
        default:false
    },
    is_delete:{
        type:Boolean,
        default:false
    },
    device_token:{
        type:String,
        default:"123456789"
    },
    device_type:{
        type:String,
        default:"Android"
    },
    social_token:{
        type:String,
        default:"987654321"
    },
    social_type:{
        type:String,
        default:"facebook"
    },
},{
    timestamps:true
})

module.exports=mongoose.model("user",userSchema);