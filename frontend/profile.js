let user =
    JSON.parse(
        localStorage.getItem("currentUser")
    );

function loadUserNavbar(){

    let user =
        JSON.parse(
            localStorage.getItem("currentUser")
        );

    let userSection =
        document.getElementById("userSection");


    if(!user){

        userSection.innerHTML = `

            <a href="login.html">
                Sign In
            </a>

            <a href="signup.html">
                Sign Up
            </a>

        `;

        return;

    }


    userSection.innerHTML = `

        <div class="profile-menu">

            <img 
                src="${user.profilePic || 'images/default-profile.png'}"
                width="40"
                height="40"
                class="nav-profile-img"
            >

            <b>${user.username}</b>

            <button onclick="toggleProfileMenu()">
                ▼
            </button>

            <div id="profileDropdown" class="profile-dropdown">

                <a href="profile.html">
                    👤 Profile
                </a>

                <a href="favorites.html">
                    ❤️ Saved Recipes
                </a>

                <a href="myRatings.html">
                    ⭐ My Ratings
                </a>

                <a href="myReviews.html">
                    💬 My Reviews
                </a>

                <button onclick="logout()">
                    🚪 Logout
                </button>

            </div>

        </div>

    `;

}


loadUserNavbar();
window.addEventListener("pageshow", function(){

    loadUserNavbar();

});


function logout(){

    localStorage.removeItem("currentUser");

    window.location.href="index.html";

}
function toggleProfileMenu(){


let menu =
document.getElementById("profileDropdown");


if(menu.style.display==="block"){

    menu.style.display="none";

}

else{

    menu.style.display="block";

}


}

let uploadedImage="";


let profileUpload =
document.getElementById("profileUpload");


if(profileUpload){

    profileUpload.addEventListener(
    "change",
    function(){

        let file = this.files[0];


        if(file){

            uploadedImage = file;


            let preview =
            document.getElementById("previewImage");


            preview.src =
            URL.createObjectURL(file);


            preview.style.display = "block";

        }

    });

}

async function loadSavedRecipes(){


let container =
document.getElementById("savedRecipes");


if(!container){
    return;
}



try{


let response = await fetch(
    "https://recipe-finder-gdak.onrender.com/api/favorites",
    {
        headers:{
            "Authorization":
            "Bearer " + localStorage.getItem("token")
        }
    }
);



let favorites =
await response.json();



if(favorites.length === 0){


container.innerHTML =
`
<p>No saved recipes yet</p>
`;


return;

}



container.innerHTML = "";



let recipeResponse = await fetch(
"https://recipe-finder-gdak.onrender.com/api/recipes"
);


let allRecipes = await recipeResponse.json();



favorites.forEach(favorite => {

    let recipe = allRecipes.find(
        r => String(r._id) === String(favorite.recipeId)
    );

    console.log("PROFILE FAVORITE:", favorite);
    console.log("PROFILE RECIPE OBJECT:", recipe);

    if(recipe){

        container.innerHTML +=

        `
        <div class="saved-card">

            <img
            src="${recipe.image}"
            width="120"
            height="100"
            >

            <h3>
            ${recipe.name}
            </h3>

            <button onclick="openRecipe('${recipe._id}')">
            View Recipe
            </button>

        </div>
        `;

    }
    else {

        console.log(
            "⚠️ Saved recipe no longer exists:",
            favorite.recipeId
        );

    }

});


}

catch(error){

console.log(
"Favorites Error:",
error
);

}



}

function openRecipe(id){

    console.log("========== OPEN RECIPE ==========");
    console.log("ID received:", id);

    localStorage.setItem("selectedRecipeId", id);
    localStorage.removeItem("selectedRecipe");

    console.log(
        "selectedRecipeId:",
        localStorage.getItem("selectedRecipeId")
    );

    console.log(
        "selectedRecipe:",
        localStorage.getItem("selectedRecipe")
    );

    window.location.href = "recipe.html";
}
async function loadMyRatings(){


let container =
document.getElementById("myRatings");


if(!container){
    return;
}


try{


let response = await fetch(

"https://recipe-finder-gdak.onrender.com/api/ratings/user/"
+
user.id

);



let ratings =
await response.json();



if(ratings.length === 0){


container.innerHTML =
`
<p>No ratings yet</p>
`;

return;

}



container.innerHTML="";



ratings.forEach(rating=>{


let recipe = rating.recipeId;



if(recipe){


container.innerHTML +=

`

<div class="rating-card">


<h3>
${recipe.name}
</h3>


<p>

${"⭐".repeat(rating.rating)}

</p>


<p>
${rating.rating}/5
</p>


</div>

`;

}


});


}

catch(error){

console.log(
"Ratings Error:",
error
);

}


}
async function loadMyReviews(){


let container =
document.getElementById("myReviews");


if(!container){
    return;
}



try{


let response = await fetch(

"https://recipe-finder-gdak.onrender.com/api/comments/user/"
+
user.id

);



let comments =
await response.json();



if(comments.length === 0){


container.innerHTML =
`
<p>No reviews yet</p>
`;

return;

}



container.innerHTML = "";



comments.forEach(comment=>{


let recipe = comment.recipeId;



container.innerHTML +=

`

<div class="review-card">


<h3>
${recipe ? recipe.name : "Recipe"}
</h3>


<p>
"${comment.text}"
</p>


<small>

${new Date(comment.createdAt)
.toLocaleDateString()}

</small>


</div>

`;


});


}

catch(error){

console.log(
"My Reviews Error:",
error
);

}


}
loadSavedRecipes();
loadMyRatings();
loadMyReviews();