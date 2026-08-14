const express = require("express");
const router = express.Router();

const multer = require("multer");
const cloudinary = require("../config/cloudinary");

// Store image temporarily in memory
const upload = multer({
    storage: multer.memoryStorage()
});


// Upload image
router.post("/", upload.single("image"), async (req, res) => {

    console.log("🔥 UPLOAD ROUTE HIT");

    try {

        if (!req.file) {

            console.log("❌ NO FILE RECEIVED");

            return res.status(400).json({
                error: "No image uploaded"
            });

        }


        // Upload image to Cloudinary
        const result =
            await new Promise((resolve, reject) => {

                const stream =
                    cloudinary.uploader.upload_stream(
                        {
                            folder: "recipe-finder/profiles"
                        },

                        (error, result) => {

                            if (error) {
                                reject(error);
                            }
                            else {
                                resolve(result);
                            }

                        }
                    );

                stream.end(req.file.buffer);

            });


        console.log(
            "☁️ Image uploaded to Cloudinary:",
            result.secure_url
        );


        res.json({

            imageUrl: result.secure_url

        });

    }

    catch (error) {

        console.log(
            "❌ Cloudinary upload error:",
            error
        );

        res.status(500).json({

            error: error.message

        });

    }

});


module.exports = router;