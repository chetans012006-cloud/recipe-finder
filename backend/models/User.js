const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({

    username:{
        type:String,
        required:true,
        unique:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },
    role:{
    type:String,
    default:"user"
},

    password:{
    type:String,
    required:true
},

resetToken:{
    type:String
},

resetTokenExpire:{
    type:Date
},

    profilePic:{
    type:String,
    default:"https://cdn-icons-png.flaticon.com/512/149/149071.png"
},

role:{
    type:String,
    enum:["user","admin"],
    default:"user"
},

    favorites:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Recipe"
    }
],
    createdAt:{
        type:Date,
        default:Date.now
    }

    

});




module.exports = mongoose.model("User", userSchema);