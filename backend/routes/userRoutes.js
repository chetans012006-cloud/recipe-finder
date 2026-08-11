const express = require("express");
const router = express.Router();

const User = require("../models/User");
const crypto = require("crypto");
const sendEmail = require("../config/mail");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

console.log("🔥 userRoutes active");


// Test route
router.get("/test", (req, res) => {

    console.log("🔥 TEST ROUTE HIT");

    res.send("User route is working");

});


// Register user
router.post("/register", async (req, res) => {

    try {

        const { username, email, password, profilePic } = req.body;

const hashedPassword =
await bcrypt.hash(password,10);
        const newUser = new User({

    username,
    email,
    password: hashedPassword,
    profilePic

});


        await newUser.save();


        res.status(201).json({

            message: "User created successfully",
            user: newUser

        });


    } catch(error) {

        res.status(500).json({

            error: error.message

        });

    }

});



// Login user
router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;


        const user = await User.findOne({ email });


        if(!user){

            return res.status(404).json({

                message: "User not found"

            });

        }



        const isMatch = await bcrypt.compare(
    password,
    user.password
);

if (!isMatch) {

    return res.status(400).json({

        message: "Invalid password"

    });

}



       const token = jwt.sign(

{
    id:user._id,
    email:user.email,
    role:user.role
},

    process.env.JWT_SECRET,

    {
        expiresIn:"7d"
    }

);


res.status(200).json({

    message:"Login successful",

    token:token,

    user:{

    id:user._id,
    username:user.username,
    email:user.email,
    profilePic:user.profilePic,
    role:user.role

}

});


    } catch(error) {

        res.status(500).json({

            error: error.message

        });

    }

});
// Forgot Password

router.post("/forgot-password", async(req,res)=>{

    try{

        const {email}=req.body;


        const user = await User.findOne({email});
        console.log("REQUEST EMAIL:", email);
console.log("FOUND USER:", user.username);
console.log("SENDING EMAIL TO:", user.email);

        if(!user){

            return res.status(404).json({
                message:"User not found"
            });

        }


        const token =
        crypto.randomBytes(32).toString("hex");


        user.resetToken = token;

        user.resetTokenExpire =
        Date.now() + 15 * 60 * 1000;


        await user.save();



       const resetLink =
       `http://127.0.0.1:5500/reset-password.html?token=${token}`;
       console.log("RESET LINK GENERATED:", resetLink);

        console.log("RESET LINK:", resetLink);
        await sendEmail(

    user.email,

    "Recipe Finder Password Reset",

    `

    <h2>Password Reset Request</h2>

    <p>
    Click the link below to reset your password:
    </p>

    <a href="${resetLink}" target="_blank">
Reset Password
</a>

<p>${resetLink}</p>

    <p>
    This link expires in 15 minutes.
    </p>

    `

);



        res.json({

            message:"Password reset link sent"

        });



    }
    catch(error){

        console.log(error);

        res.status(500).json({

            error:error.message

        });

    }


});

router.post("/reset-password", async(req,res)=>{
    console.log("RESET PASSWORD ROUTE HIT");

    try{

        const {token, password} = req.body;


        const user = await User.findOne({

            resetToken: token,

            resetTokenExpire:{
                $gt: Date.now()
            }

        });



        if(!user){

            return res.status(400).json({

                message:"Invalid or expired token"

            });

        }



        // update password

       user.password = await bcrypt.hash(password, 10);



        // remove token after use

        user.resetToken = undefined;

        user.resetTokenExpire = undefined;



        await user.save();



        res.json({

            message:"Password reset successful"

        });


    }
    catch(error){

        console.log(error);


        res.status(500).json({

            error:error.message

        });

    }


});
// ===============================
// Favorite Recipes
// ===============================


// Add favorite recipe
router.post("/favorite", auth, async(req,res)=>{

    try{


        const userId = req.user.id;

        const {recipeId} = req.body;



        let user = await User.findById(userId);



        if(!user){

            return res.status(404).json({

                message:"User not found"

            });

        }



        // prevent duplicate favorites

        if(user.favorites.includes(recipeId)){


            return res.status(400).json({

                message:"Recipe already saved"

            });


        }



        user.favorites.push(recipeId);



        await user.save();



        res.json({

            message:"Recipe added to favorites",

            favorites:user.favorites

        });



    }
    catch(error){


        res.status(500).json({

            error:error.message

        });


    }


});




// Remove favorite recipe
router.delete("/favorite", async(req,res)=>{

    try{

        const {userId, recipeId} = req.body;


        let user = await User.findById(userId);


        if(!user){

            return res.status(404).json({
                message:"User not found"
            });

        }


        user.favorites =
        user.favorites.filter(
            id => id.toString() !== recipeId
        );


        await user.save();


        res.json({

            message:"Removed from favorites",
            favorites:user.favorites

        });


    }
    catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});




// Get favorite recipes
router.get("/favorites/:userId", async(req,res)=>{

    try{


        let user = await User.findById(req.params.userId)
        .populate("favorites");


        if(!user){

            return res.status(404).json({
                message:"User not found"
            });

        }


        res.json({

            favorites:user.favorites

        });


    }
    catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});

// Update Profile

router.put("/:id", async(req,res)=>{

    try{

        const {username, profilePic} = req.body;


        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                username,
                profilePic
            },
            {
                new:true
            }
        );


        res.json({

            message:"Profile updated",
            user:user

        });


    }
    catch(error){

        res.status(500).json({

            error:error.message

        });

    }

});

// JWT Test Protected Route

router.get("/profile", auth, async(req,res)=>{


    try{


        const user = await User.findById(req.user.id);


        if(!user){

            return res.status(404).json({

                message:"User not found"

            });

        }


        res.json({

            message:"Protected route accessed",

            user:{

                id:user._id,
                username:user.username,
                email:user.email

            }

        });


    }
    catch(error){


        res.status(500).json({

            error:error.message

        });


    }


});

module.exports = router;