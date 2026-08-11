const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    image:{
        type:String
    },

    category:{
        type:String,
        default:"General"
    },

    difficulty:{
        type:String,
        default:"Easy"
    },

    rating:{
        type:Number,
        default:0
    },

    reviews:{
        type:Number,
        default:0
    },

    time:{
        type:String,
        default:"0 mins"
    },

    servings:{
        type:Number,
        default:1
    },

    ingredients:{
        type:[String],
        required:true
    },

    steps:{
    type:[
        {
            title:{
                type:String,
                required:true
            },

            image:{
                type:String,
                default:""
            },
            slug:{
 type:String
},

            description:{
                type:String,
                required:true
            },

            time:{
                type:Number,
                default:0
            }
        }
    ],
    required:true
},

    nutrition:{
        calories:{
            type:String,
            default:""
        },
        protein:{
            type:String,
            default:""
        },
        carbs:{
            type:String,
            default:""
        },
        fat:{
            type:String,
            default:""
        }
    },

    chefTips:{
        type:[String],
        default:[]
    },
    ownerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},
    foodType:{
    type:String,
    enum:["Veg","Non-Veg"]
},
tags:{
    type:[String],
    default:[]
},
    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports = mongoose.model("Recipe", recipeSchema);