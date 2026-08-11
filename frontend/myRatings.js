console.log("myRatings.js loaded");


let currentUser =
JSON.parse(localStorage.getItem("currentUser"));


let ratingsContainer =
document.getElementById("ratingsContainer");



async function loadMyRatings(){


try{


    // Get user ratings

    let ratingResponse = await fetch(

        "https://recipe-finder-gdak.onrender.com/api/api/ratings/user/" 
        + currentUser.id

    );


    let ratings = await ratingResponse.json();



    // Get all recipes

    let recipeResponse = await fetch(

        "https://recipe-finder-gdak.onrender.com/api/api/recipes"

    );


    let recipes = await recipeResponse.json();



    console.log("Ratings:", ratings);
    console.log("Recipes:", recipes);



    if(ratings.length === 0){

        ratingsContainer.innerHTML =
        "<h3>No ratings yet ⭐</h3>";

        return;

    }



    ratingsContainer.innerHTML="";



    ratings.forEach(rating=>{


        let recipe = rating.recipeId;



        if(recipe){


            ratingsContainer.innerHTML += `


            <div class="card">


            <img src="${recipe.image}">


            <h2>
            ${recipe.name}
            </h2>


           <p>
Your Rating:
${"⭐".repeat(rating.rating)}
${"☆".repeat(5-rating.rating)}
</p>

<p>
📅 Rated on:
${new Date(rating.createdAt).toLocaleDateString()}
</p>


           <button onclick="viewRecipe('${recipe._id}')">

            View Recipe

            </button>


            </div>


            `;


        }


    });



}
catch(error){

    console.log(error);

}


}



function viewRecipe(id){

    localStorage.setItem(
        "selectedRecipe",
        id
    );

    window.location.href="recipe.html";

}



loadMyRatings();