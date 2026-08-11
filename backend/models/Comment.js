const mongoose = require("mongoose");


const replySchema = new mongoose.Schema({
    
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    text:{
        type:String,
        required:true
    },


    replyTo:{
        type:String
    },

    likes:{
        type:Number,
        default:0
    },
    likedBy:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
],

    reportCount:{
        type:Number,
        default:0
    },
    reportedBy:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
],

    createdAt:{
    type:Date,
    default:Date.now
},

editedAt:{
    type:Date
}

});


// Make replies recursive after schema creation
replySchema.add({
    replies:[replySchema]
});


const commentSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    recipeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Recipe",
        required:true
    },

    text:{
        type:String,
        required:true
    },
    pinned:{
    type:Boolean,
    default:false
},

    likes:{
    type:Number,
    default:0
},

likedBy:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
],
    reportCount:{
        type:Number,
        default:0
    },

    reportedBy:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
],

    replies:[replySchema],

    createdAt:{
        type:Date,
        default:Date.now
    },
    editedAt:{
    type:Date
    }
});


module.exports = mongoose.model("Comment", commentSchema);