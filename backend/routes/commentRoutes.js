const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const Recipe = require("../models/Recipe");

function findReply(replies, replyId){

    for(let reply of replies){


        if(reply._id.toString() === replyId){

            return reply;

        }



        if(reply.replies && reply.replies.length > 0){


            let found = findReply(
                reply.replies,
                replyId
            );


            if(found){

                return found;

            }

        }

    }


    return null;

}
// Add comment

router.post("/", async(req,res)=>{

    try{

        const newComment = new Comment(req.body);

        await newComment.save();

        res.status(201).json({
            message:"Comment added",
            comment:newComment
        });


    }
    catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});

// Get comments by user

router.get("/user/:userId", async(req,res)=>{

    try{


        const comments = await Comment.find({
    userId:req.params.userId
})
.populate("recipeId");

        res.json(comments);


    }
    catch(error){


        res.status(500).json({

            error:error.message

        });


    }

});

// Get comments of recipe

router.get("/:recipeId", async(req,res)=>{

try{

const comments = await Comment.find({
    recipeId:req.params.recipeId
})
.populate("userId","username profilePic");


async function populateReplies(replies){

    for(let reply of replies){

        await Comment.populate(
            reply,
            {
                path:"userId",
                select:"username profilePic"
            }
        );


        if(reply.replies && reply.replies.length > 0){

            await populateReplies(reply.replies);

        }

    }

}


for(let comment of comments){

    await populateReplies(comment.replies);

}


res.json(comments);


}
catch(error){

res.status(500).json({
error:error.message
});

}

});



router.put("/like/:id", async(req,res)=>{

    try{

        const {userId} = req.body;


        const comment = await Comment.findById(req.params.id);
        
          
        if(!comment){

            return res.status(404).json({
                message:"Comment not found"
            });

        }
if(!comment.likedBy){
    comment.likedBy = [];
}

        let alreadyLiked = comment.likedBy.some(
    id => id && id.toString() === userId
);


        if(alreadyLiked){


           comment.likedBy =
comment.likedBy.filter(
    id => id && id.toString() !== userId
);


            comment.likes--;


        }

        else{


            comment.likedBy.push(userId);


            comment.likes++;


        }


        await comment.save();


        res.json({

            likes:comment.likes,

            likedBy:comment.likedBy,

            liked:!alreadyLiked

        });


    }

    catch(error){


        res.status(500).json({

            error:error.message

        });


    }

});

router.delete("/:id", async(req,res)=>{

    try{

        await Comment.findByIdAndDelete(req.params.id);


        res.json({
            message:"Comment deleted"
        });


    }
    catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});
router.put("/:id", async(req,res)=>{

    try{

        const comment = await Comment.findById(req.params.id);


        if(!comment){

            return res.status(404).json({
                message:"Comment not found"
            });

        }


        comment.text = req.body.text;

        comment.editedAt = new Date();


        await comment.save();


        res.json({
            message:"Comment updated",
            comment:comment
        });


    }
    catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});

router.put("/report/:id", async(req,res)=>{

    try{

        let {userId} = req.body;


        let comment = await Comment.findById(req.params.id);


        if(!comment){

            return res.status(404).json({
                error:"Comment not found"
            });

        }



        // Check already reported

        if(comment.reportedBy.includes(userId)){


            return res.json({

                message:"Already reported",

                reportCount:comment.reportCount

            });


        }



        // Add user report

        comment.reportedBy.push(userId);


        comment.reportCount += 1;


        await comment.save();



        res.json({

            message:"Reported successfully",

            reportCount:comment.reportCount

        });


    }

    catch(error){

        console.log(error);

        res.status(500).json({
            error:error.message
        });

    }


});

router.post("/reply/:id", async(req,res)=>{

    try{

        const comment = await Comment.findById(req.params.id);


        if(!comment){

            return res.status(404).json({
                message:"Comment not found"
            });

        }


        comment.replies.push(req.body);


        await comment.save();
      

if(String(comment.userId) !== String(req.body.userId)){

   

  

    

   

   

    

    



}


        res.json({
            message:"Reply added",
            comment:comment
        });


    }
    catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});

router.put("/reply/like/:commentId/:replyId", async(req,res)=>{

    try{

        const comment = await Comment.findById(
            req.params.commentId
        );


        if(!comment){

            return res.status(404).json({
                message:"Comment not found"
            });

        }



        function findReply(replies,id){

            for(let reply of replies){


                if(reply._id.toString() === id){

                    return reply;

                }


                if(reply.replies && reply.replies.length > 0){

                    let found = findReply(
                        reply.replies,
                        id
                    );


                    if(found){

                        return found;

                    }

                }

            }


            return null;

        }



        let reply = findReply(
            comment.replies,
            req.params.replyId
        );



        if(!reply){

            return res.status(404).json({
                message:"Reply not found"
            });

        }



        if(!reply.likedBy){

    reply.likedBy = [];

}


let alreadyLiked =
reply.likedBy.some(
    id => id && id.toString() === req.body.userId
);



if(alreadyLiked){


   reply.likedBy =
reply.likedBy.filter(
    id => id && id.toString() !== req.body.userId
);


    reply.likes--;


}
else{


    reply.likedBy.push(req.body.userId);

    reply.likes++;

}



await comment.save();


        res.json({

            message:"Reply liked",
            reply

        });


    }
    catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});
// Add nested reply
router.post("/reply/:commentId/:replyId", async(req,res)=>{

    try{

        const comment = await Comment.findById(req.params.commentId);

        if(!comment){

            return res.status(404).json({
                message:"Comment not found"
            });

        }


        function findReply(replies,id){

            for(let reply of replies){

                if(reply._id.toString() === id){

                    return reply;

                }

                if(reply.replies.length > 0){

                    let found = findReply(reply.replies,id);

                    if(found) return found;

                }

            }

            return null;

        }


        let parentReply = findReply(
            comment.replies,
            req.params.replyId
        );


        if(!parentReply){

            return res.status(404).json({
                message:"Reply not found"
            });

        }


        parentReply.replies.push({

    userId:req.body.userId,

    text:req.body.text,

    replyTo:req.body.replyTo,

    likes:0,

    reportCount:0,

    replies:[],

    createdAt:new Date()

});


        await comment.save();


        res.json({
            message:"Nested reply added",
            comment
        });


    }
    catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});

// Edit reply / nested reply

router.put("/reply/:commentId/:replyId", async(req,res)=>{

    try{

        const comment = await Comment.findById(req.params.commentId);


        if(!comment){

            return res.status(404).json({
                message:"Comment not found"
            });

        }



        function findReply(replies,id){

            for(let reply of replies){

                if(reply._id.toString() === id){

                    return reply;

                }


                if(reply.replies && reply.replies.length > 0){

                    let found = findReply(
                        reply.replies,
                        id
                    );


                    if(found) return found;

                }

            }


            return null;

        }



        let reply = findReply(
            comment.replies,
            req.params.replyId
        );


        if(!reply){

            return res.status(404).json({
                message:"Reply not found"
            });

        }



        reply.text = req.body.text;

        reply.editedAt = new Date();
        await comment.save();



        res.json({

            message:"Reply updated",
            reply

        });



    }
    catch(error){

        res.status(500).json({
            error:error.message
        });

    }


});


// Delete reply

router.delete("/reply/:commentId/:replyId", async(req,res)=>{


    try{


        const comment = await Comment.findById(
            req.params.commentId
        );


        if(!comment){

            return res.status(404).json({
                message:"Comment not found"
            });

        }



        function deleteReply(replies,id){


            for(let i=0;i<replies.length;i++){


                if(replies[i]._id.toString() === id){

                    replies.splice(i,1);

                    return true;

                }


                if(
                    replies[i].replies &&
                    replies[i].replies.length > 0
                ){

                    let deleted =
                    deleteReply(
                        replies[i].replies,
                        id
                    );


                    if(deleted){

                        return true;

                    }

                }


            }


            return false;

        }



        let deleted = deleteReply(
            comment.replies,
            req.params.replyId
        );



        if(!deleted){

            return res.status(404).json({
                message:"Reply not found"
            });

        }



        await comment.save();



        res.json({

            message:"Reply deleted"

        });



    }
    catch(error){

        res.status(500).json({
            error:error.message
        });

    }


});


// Report reply

router.put("/reply/report/:commentId/:replyId", async(req,res)=>{

    try{

        let {userId} = req.body;


        let comment = await Comment.findById(req.params.commentId);


        if(!comment){

            return res.status(404).json({
                error:"Comment not found"
            });

        }


        let reply = findReply(
    comment.replies,
    req.params.replyId
);



        if(!reply){

            return res.status(404).json({
                error:"Reply not found"
            });

        }



        if(reply.reportedBy.includes(userId)){


            return res.json({

                message:"Already reported",

                reportCount:reply.reportCount

            });

        }



        reply.reportedBy.push(userId);


        reply.reportCount += 1;


        await comment.save();



        res.json({

            message:"Reply reported successfully",

            reportCount:reply.reportCount

        });


    }

    catch(error){

        console.log(error);

        res.status(500).json({
            error:error.message
        });

    }


});


router.put("/pin/:id", async(req,res)=>{

    try{

        const {userId} = req.body;


        const comment = await Comment.findById(req.params.id)
        .populate("userId");


        console.log("BODY USER ID:", userId);

        console.log("COMMENT:", comment);

        console.log("COMMENT USER:", comment?.userId);


        if(!comment){

            return res.status(404).json({
                error:"Comment not found"
            });

        }


        console.log(
            "COMMENT USER ID:",
            comment.userId?._id
        );


        if(comment.userId._id.toString() !== userId){

            return res.status(403).json({
                error:"Only owner can pin"
            });

        }


        comment.pinned = !comment.pinned;

await comment.save();


res.json({

    message:"Pin updated",

    pinned: comment.pinned

});


    }
    catch(error){

        console.log("PIN ERROR:",error);

        res.status(500).json({

            error:error.message

        });

    }

});

module.exports = router;