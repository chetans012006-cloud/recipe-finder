const express = require("express");
const router = express.Router();

const Favorite = require("../models/Favorite");
const authMiddleware = require("../middleware/auth");
console.log("🔥 favoriteRoutes active");


// Add favorite

router.post("/", authMiddleware, async(req,res)=>{

    try{

        const userId = req.user.id;
const { recipeId } = req.body;


        // prevent duplicate save

        let existing = await Favorite.findOne({
            userId,
            recipeId
        });


        if(existing){

            return res.status(400).json({
                message:"Recipe already saved"
            });

        }


        const favorite = new Favorite({

            userId,
            recipeId

        });


        await favorite.save();


        res.status(201).json({

            message:"Recipe saved ❤️",
            favorite

        });


    }
    catch(error){

        res.status(500).json({

            error:error.message

        });

    }

});

router.delete("/:recipeId", authMiddleware, async(req,res)=>{

    try {

        await Favorite.findOneAndDelete({

           userId: req.user.id,
recipeId: req.params.recipeId

        });

        res.json({

            message: "Favorite removed"

        });

    }

    catch(error){

        res.status(500).json({

            error: error.message

        });

    }

});

// Get user's saved recipes

router.get("/", authMiddleware, async(req,res)=>{

    try{

        const favorites = await Favorite.find({

    userId: req.user.id

})
.populate("recipeId");


        res.json(favorites);


    }
    catch(error){

        res.status(500).json({

            error:error.message

        });

    }

});









module.exports = router;