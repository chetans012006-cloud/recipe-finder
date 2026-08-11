const dns = require("dns");

dns.setServers(["8.8.8.8"]);

require("dotenv").config();

const mongoose = require("mongoose");
const Comment = require("./models/Comment");

mongoose.connect(process.env.MONGO_URI)
.then(async()=>{

    console.log("MongoDB connected");

    let comments = await Comment.find();

    for(let comment of comments){

        for(let reply of comment.replies){

            for(let nested of reply.replies){

                if(typeof nested.userId === "string"){

                    nested.userId = new mongoose.Types.ObjectId(nested.userId);

                }

            }

        }

        await comment.save();

    }

    console.log("Nested replies fixed");

    process.exit();

})
.catch(err=>console.log(err));