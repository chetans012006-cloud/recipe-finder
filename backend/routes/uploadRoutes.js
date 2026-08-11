const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

    destination: function(req,file,cb){

        cb(null,"uploads/");

    },

    filename: function(req,file,cb){

        const uniqueName =
        Date.now() +
        path.extname(file.originalname);

        cb(null,uniqueName);

    }

});

const upload = multer({
    storage:storage
});


router.post("/",upload.single("image"),(req,res)=>{

    res.json({

        imageUrl:
        "http://localhost:5000/uploads/"
        + req.file.filename

    });

});

module.exports = router;