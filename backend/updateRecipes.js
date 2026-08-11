const dns = require("dns");

dns.setServers(["8.8.8.8"]);

const mongoose = require("mongoose");
require("dotenv").config();

const Recipe = require("./models/Recipe");

console.log("MONGO URI:");
console.log(process.env.MONGO_URI);


async function updateRecipes(){

    try{

        await mongoose.connect(process.env.MONGO_URI,{
            serverSelectionTimeoutMS:5000
        });


        console.log("MongoDB connected");


        await Recipe.updateOne(
            {name:"Pizza"},
            {
                $set:{
                    foodType:"Veg",
                    category:"Italian",
                    difficulty:"Easy",
                    rating:4.8,
                    reviews:245,
                    time:"30 mins",
                    servings:4,

                    nutrition:{
                        calories:"285 kcal",
                        protein:"12 g",
                        carbs:"36 g",
                        fat:"10 g"
                    },

                    chefTips:[
                        "Always preheat the oven before baking.",
                        "Use fresh mozzarella for better taste.",
                        "Avoid adding too many toppings."
                    ]
                }
            }
        );


        await Recipe.updateOne(
            {name:"Burger"},
            {
                $set:{
                    foodType:"Non-Veg",
                    category:"Fast Food",
                    difficulty:"Easy",
                    rating:4.6,
                    reviews:210,
                    time:"20 mins",
                    servings:2
                }
            }
        );


        await Recipe.updateOne(
            {name:"Pasta"},
            {
                $set:{
                    foodType:"Veg",
                    category:"Italian",
                    difficulty:"Easy",
                    rating:4.7,
                    reviews:180,
                    time:"25 mins",
                    servings:3
                }
            }
        );


        await Recipe.updateOne(
            {name:"Biryani"},
            {
                $set:{
                    foodType:"Non-Veg",
                    category:"Indian",
                    difficulty:"Medium",
                    rating:4.9,
                    reviews:350,
                    time:"60 mins",
                    servings:4
                }
            }
        );


        console.log("Recipes updated successfully");


        mongoose.connection.close();


    }
    catch(error){

        console.log("Mongo Error:",error);

    }

}


updateRecipes();