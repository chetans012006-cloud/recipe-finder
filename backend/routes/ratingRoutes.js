const express = require("express");
const router = express.Router();

console.log("🔥 ratingRoutes.js file executed");


console.log("Rating routes loaded");
const Rating = require("../models/Rating");
console.log("Rating model loaded");

// Add rating

router.post("/", async(req,res)=>{

    try{

        const {userId, recipeId, rating} = req.body;


        // Check if user already rated

        let existingRating = await Rating.findOne({
            userId:userId,
            recipeId:recipeId
        });


        if(existingRating){

            return res.status(400).json({
                message:"You already rated this recipe"
            });

        }


        const newRating = new Rating({

            userId,
            recipeId,
            rating

        });


        await newRating.save();


        res.status(201).json({

            message:"Rating added",
            rating:newRating

        });


    }
    catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});
// Update existing rating

// Update existing rating

router.put("/:recipeId", async (req, res) => {

    try {

        const { userId, rating } = req.body;

        const updatedRating = await Rating.findOneAndUpdate(

            {
                userId: userId,
                recipeId: req.params.recipeId
            },

            {
                rating: rating
            },

            {
                new: true
            }

        );

        if (!updatedRating) {

            return res.status(404).json({
                message: "Rating not found"
            });

        }

        res.json({
            message: "Rating updated",
            rating: updatedRating
        });

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

router.get("/test", (req,res)=>{

    console.log("🔥 TEST ROUTE HIT");

    res.json({
        message:"Rating route working"
    });

});

// Get all ratings by a user

router.get("/user/:userId", async(req,res)=>{

    try{


        const ratings = await Rating.find({
    userId:req.params.userId
})
.populate("recipeId");


        res.json(ratings);


    }
    catch(error){


        res.status(500).json({

            error:error.message

        });


    }

});
// Get recipe rating details

router.get("/:recipeId", async(req,res)=>{

    try{


       const ratings = await Rating.find({

    recipeId: req.params.recipeId

}).populate("userId");

        let total = 0;


        ratings.forEach(r=>{

            total += r.rating;

        });



        let average = 0;


        if(ratings.length > 0){

            average = total / ratings.length;

        }



        res.json({

            average:average.toFixed(1),

            count:ratings.length,

            ratings:ratings

        });



    }
    catch(error){

        res.status(500).json({

            error:error.message

        });

    }

});

console.log(
    router.stack.map(route => route.route?.path)
);

module.exports = router;