const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Upload folder
const uploadFolder = path.join(
    __dirname,
    "../uploads/recipes"
);

// Create folder if it doesn't exist
if (!fs.existsSync(uploadFolder)) {

    fs.mkdirSync(uploadFolder, {
        recursive: true
    });

}

// Storage
const storage = multer.diskStorage({

    destination: function(req, file, cb) {

        cb(null, uploadFolder);

    },

    filename: function(req, file, cb) {

        const uniqueName =
            Date.now() +
            "-" +
            file.originalname;

        cb(null, uniqueName);

    }

});

// Multer
const upload = multer({
    storage: storage
});

module.exports = upload;