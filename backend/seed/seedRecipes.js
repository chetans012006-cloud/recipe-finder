const dns = require("dns");

dns.setServers(["8.8.8.8"]);

require("dotenv").config();

const mongoose = require("mongoose");
const Recipe = require("../models/Recipe");



const recipes = require("./recipes.json");




async function seed(){

try{

await mongoose.connect(process.env.MONGO_URI);

console.log("MongoDB connected");


// DO NOT DELETE RECIPES

for (const recipe of recipes) {

    await Recipe.findOneAndUpdate(

        { name: recipe.name },

        recipe,

        {
            upsert: true,
            new: true
        }

    );

}

console.log("Recipes updated successfully");


console.log("Recipes inserted successfully");


process.exit();


}
catch(error){

console.log(error);

process.exit(1);

}

}


seed();