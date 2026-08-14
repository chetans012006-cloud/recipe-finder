const multer = require("multer");

// Store uploaded image temporarily in memory
const storage = multer.memoryStorage();

// Multer
const upload = multer({
    storage: storage
});

module.exports = upload;