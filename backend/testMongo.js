const dns = require("dns");

dns.setServers(["8.8.8.8"]);
const mongoose=require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("CONNECTED");
    process.exit();
})
.catch(err=>{
    console.log(err);
});