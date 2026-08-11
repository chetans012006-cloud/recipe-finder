const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const mongoose = require("mongoose");
require("dotenv").config();


async function removeInstructions(){

    try{

        await mongoose.connect(
            process.env.MONGO_URI
        );


        console.log("MongoDB connected");


        const result = await mongoose.connection
        .collection("recipes")
        .updateMany(
            {},
            {
                $unset:{
                    instructions:""
                }
            }
        );


        console.log(
            "Removed instructions:",
            result.modifiedCount
        );


    }

    catch(error){

        console.log(error);

    }

    finally{

        mongoose.connection.close();

    }

}


removeInstructions();