
const dns = require("dns");

dns.setServers(["8.8.8.8"]);
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

console.log(process.env.MONGO_URI);

const app = express();

app.use(cors());
app.use(express.json({
    limit:"10mb"
}));
app.use(express.urlencoded({
    extended:true,
    limit:"10mb"
}));



const userRoutes = require("./routes/userRoutes");

app.use("/api/users", userRoutes);
const commentRoutes = require("./routes/commentRoutes");

app.use("/api/comments", commentRoutes);

const ratingRoutes = require("./routes/ratingRoutes");

app.use("/api/ratings", ratingRoutes);
const favoriteRoutes = require("./routes/favoriteRoutes");

app.use("/api/favorites", favoriteRoutes);

const adminRoutes =
require("./routes/adminRoutes");


app.use(
"/api/admin",
adminRoutes
);


app.get("/api/ratings/test2", (req,res)=>{

    console.log("🔥 DIRECT SERVER TEST HIT");

    res.json({
        message:"server direct route works"
    });

});
console.log("Rating route mounted");
const recipeRoutes = require("./routes/recipeRoutes");

app.use("/api/recipes", recipeRoutes);

const kitchenAiRoutes =
    require("./routes/kitchenAiRoutes");

app.use(
    "/api/kitchen-ai",
    kitchenAiRoutes
);


app.get("/api/ratings/test", (req,res)=>{

    console.log("DIRECT TEST HIT");

    res.json({
        message:"server direct test works"
    });

});

// MongoDB Connection

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected ✅");
})
.catch((error) => {
    console.log("MongoDB Connection Error:", error);
});


// Test Route

app.get("/", (req, res) => {
    res.send("Recipe Finder Backend is Running 🚀");
});


// Start Server

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});

const path = require("path");
app.use(
"/uploads",
express.static(
path.join(__dirname,"uploads")
)
);


const uploadRoutes =
require("./routes/uploadRoutes");

app.use(
"/api/upload",
uploadRoutes
);