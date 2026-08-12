const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");


// Upload folder
const uploadFolder = path.join(__dirname, "../uploads");

// Create uploads folder if it does not exist
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}


// Multer storage
const storage = multer.diskStorage({

    destination: function(req, file, cb) {

        cb(null, uploadFolder);

    },

    filename: function(req, file, cb) {

        const uniqueName =
            Date.now() +
            path.extname(file.originalname);

        cb(null, uniqueName);

    }

});


const upload = multer({
    storage: storage
});


// Upload image
router.post("/", upload.single("image"), (req, res) => {

    console.log("🔥 UPLOAD ROUTE HIT");

    try {

        if (!req.file) {

            console.log("❌ NO FILE RECEIVED");

            return res.status(400).json({
                error: "No image uploaded"
            });

        }

        const imageUrl =
            `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

        res.json({
            imageUrl: imageUrl
        });

    }

    catch (error) {

        console.log("Upload error:", error);

        res.status(500).json({
            error: error.message
        });

    }

});


module.exports = router;