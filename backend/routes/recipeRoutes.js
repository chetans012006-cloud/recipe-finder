const express = require("express");
const router = express.Router();

const Recipe = require("../models/Recipe");


// Create recipe

router.post("/", async (req,res)=>{

    try{

        const recipe = new Recipe({

    name:req.body.name,

    image:req.body.image,

    category:req.body.category,

    difficulty:req.body.difficulty,

    rating:req.body.rating,

    reviews:req.body.reviews,

    time:req.body.time,

    servings:req.body.servings,

    ingredients:req.body.ingredients,

    steps:req.body.steps,

    nutrition:req.body.nutrition,

    chefTips:req.body.chefTips,

    ownerId:req.body.ownerId,

    foodType:req.body.foodType

});


        await recipe.save();


        res.status(201).json({

            message:"Recipe created successfully",
            recipe:recipe

        });


    }
    catch(error){

        res.status(500).json({

            error:error.message

        });

    }

});


// Get all recipes

router.get("/", async(req,res)=>{

    try{

        const recipes = await Recipe.find();

        res.json(recipes);

    }

    catch(error){

        res.status(500).json({

            error:error.message

        });

    }

});

// Get single recipe by ID

router.get("/:id", async(req,res)=>{

    try{

        const recipe = await Recipe.findById(req.params.id);


        if(!recipe){

            return res.status(404).json({
                error:"Recipe not found"
            });

        }


        res.json(recipe);


    }
    catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});

module.exports = router;