const express = require("express");
const upload = require("../middleware/recipeUpload");
const router = express.Router();
router.get("/test",(req,res)=>{

    console.log("🔥 ADMIN TEST HIT");

    res.json({
        message:"Admin route working"
    });

});

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const User = require("../models/User");
const Recipe = require("../models/Recipe");
const Comment = require("../models/Comment");



router.get("/recipes",
auth,
admin,
async(req,res)=>{


try{


const recipes =
await Recipe.find();


res.json(recipes);


}

catch(error){

res.status(500).json({
error:error.message
});

}


});


// Add new recipe

router.post(
    "/recipe",
    auth,
    admin,

    upload.fields([
        {
            name: "image",
            maxCount: 1
        },
        {
            name: "stepImages",
            maxCount: 20
        }
    ]),

    async(req,res)=>{

        try{

            // Ingredients

            let ingredients = [];

            if(req.body.ingredients){

                ingredients =
                    JSON.parse(
                        req.body.ingredients
                    );

            }

           
            // Step descriptions

            let stepDescriptions = [];

            if(req.body.stepDescriptions){

                stepDescriptions =
                    JSON.parse(
                        req.body.stepDescriptions
                    );

            }


            // Create steps

            let steps =
                stepDescriptions.map(
                    (description,index)=>({

                        title:
                            "Step " + (index + 1),

                        description:
                            description,

                        image:"",

                        time:0

                    })
                );


            // Step images

            if(
                req.files &&
                req.files.stepImages
            ){

                let stepImages =
                    req.files.stepImages;


                let indexes =
                    JSON.parse(
                        req.body.stepImageIndexes || "[]"
                    );


                stepImages.forEach(
                    (file,index)=>{

                        let stepIndex =
                            indexes[index];


                        if(
                            steps[stepIndex]
                        ){

                           steps[stepIndex].image =
`${req.protocol}://${req.get("host")}/uploads/recipes/${file.filename}`;

                        }

                    }
                );

            }


            // Main recipe image

            let recipeImage = "";


            if(
                req.files &&
                req.files.image &&
                req.files.image.length > 0
            ){

                recipeImage =
`${req.protocol}://${req.get("host")}/uploads/recipes/${req.files.image[0].filename}`;

            }


            // Create recipe

            let recipe =
                new Recipe({

                    name:
                        req.body.name,

                    category:
                        req.body.category,

                    difficulty:
                        req.body.difficulty,

                    time:
                        req.body.time,

                    servings:
                        req.body.servings,

                    foodType:
                        req.body.foodType,

                    ingredients:
                        ingredients,

                    chefTips:
    req.body.chefTips
    ? JSON.parse(req.body.chefTips)
    : [],
    

                    steps:
                        steps,

                    image:
                        recipeImage,

                    ownerId:
                        req.user.id

                });


            await recipe.save();


            res.status(201).json({

                message:
                    "Recipe added successfully",

                recipe

            });

        }

        catch(error){

            console.log(error);


            res.status(500).json({

                error:
                    error.message

            });

        }

    }
);
router.put(
    "/recipe/:id",
    auth,
    admin,

    upload.fields([
        {
            name:"image",
            maxCount:1
        },
        {
            name:"stepImages",
            maxCount:20
        }
    ]),

    async(req,res)=>{

        try{

            const recipe =
                await Recipe.findById(req.params.id);


            if(!recipe){

                return res.status(404).json({

                    error:"Recipe not found"

                });

            }


            // Basic recipe information

            recipe.name =
                req.body.name;

            recipe.category =
                req.body.category;

            recipe.difficulty =
                req.body.difficulty;

            recipe.time =
                req.body.time;

            recipe.servings =
                req.body.servings;

            recipe.foodType =
                req.body.foodType;

                recipe.chefTips =
req.body.chefTips
? JSON.parse(req.body.chefTips)
: [];


            // Ingredients

            if(req.body.ingredients){

                recipe.ingredients =
                    JSON.parse(
                        req.body.ingredients
                    );

            }


            // Recipe main image

            if(
                req.files &&
                req.files.image &&
                req.files.image.length > 0
            ){

                recipe.image =
`${req.protocol}://${req.get("host")}/uploads/recipes/${req.files.image[0].filename}`;

            }


            // Step descriptions

            if(req.body.stepDescriptions){

                let descriptions =
                    JSON.parse(
                        req.body.stepDescriptions
                    );


                descriptions.forEach(
                    (description,index)=>{

                        if(recipe.steps[index]){

                            recipe.steps[index].description =
                                description;

                        }

                    }
                );

            }


            // Step images

            if(
                req.files &&
                req.files.stepImages
            ){

                let stepImages =
                    req.files.stepImages;


                let indexes =
                    JSON.parse(
                        req.body.stepImageIndexes || "[]"
                    );


                stepImages.forEach(
                    (file,index)=>{

                        let stepIndex =
                            indexes[index];


                        if(
                            recipe.steps[stepIndex]
                        ){

                            recipe.steps[stepIndex].image =
`${req.protocol}://${req.get("host")}/uploads/recipes/${file.filename}`;

                        }

                    }
                );

            }


            await recipe.save();


            res.json({

                message:
                    "Recipe updated successfully",

                recipe

            });

        }

        catch(error){

            console.log(error);

            res.status(500).json({

                error:error.message

            });

        }

    }
);


router.delete("/recipe/:id",
auth,
admin,
async(req,res)=>{


try{


await Recipe.findByIdAndDelete(
req.params.id
);


res.json({

message:"Recipe deleted"

});


}

catch(error){

res.status(500).json({
error:error.message
});

}


});




router.get("/reported-comments",
auth,
admin,
async(req,res)=>{


try{


const comments =
await Comment.find({

reportCount:{
$gt:0
}

})
.populate(
"userId",
"username"
);



res.json(comments);


}


catch(error){

res.status(500).json({
error:error.message
});

}


});





router.delete("/comment/:id",
auth,
admin,
async(req,res)=>{


try{


await Comment.findByIdAndDelete(
req.params.id
);


res.json({

message:"Comment removed"

});


}


catch(error){

res.status(500).json({
error:error.message
});

}


});

// Dashboard Statistics

router.get(
"/stats",
auth,
admin,
async(req,res)=>{

try{


const User =
require("../models/User");



const totalRecipes =
await Recipe.countDocuments();



const totalUsers =
await User.countDocuments();



const totalComments =
await Comment.countDocuments();



const reportedComments =
await Comment.countDocuments({

reportCount:{
$gt:0
}

});



res.json({

totalRecipes,

totalUsers,

totalComments,

reportedComments

});


}
catch(error){


res.status(500).json({

error:error.message

});


}


});


// Get all users

router.get(
"/users",
auth,
admin,
async(req,res)=>{


try{


const User =
require("../models/User");


const users =
await User.find()
.select("-password");


res.json(users);



}
catch(error){


res.status(500).json({

error:error.message

});


}



});


router.put(
"/user/:id/role",
auth,
admin,
async(req,res)=>{

try{

const {role}=req.body;


const user =
await User.findByIdAndUpdate(
req.params.id,
{
role:role
},
{
new:true
}
);


res.json({

message:"Role updated",
user:user

});


}
catch(error){

res.status(500).json({
error:error.message
});

}

});



// Change User Role

router.put(
"/user/:id/role",
auth,
admin,
async(req,res)=>{


try{


const {role}=req.body;



const user =
await User.findByIdAndUpdate(

req.params.id,

{
role:role
},

{
new:true
}

);



res.json({

message:"Role updated successfully",

user:user

});


}
catch(error){


res.status(500).json({

error:error.message

});


}


});


router.delete(
"/user/:id",
auth,
admin,
async(req,res)=>{

try{


await User.findByIdAndDelete(
req.params.id
);


res.json({

message:"User deleted successfully"

});


}
catch(error){

res.status(500).json({

error:error.message

});

}


});

module.exports=router;