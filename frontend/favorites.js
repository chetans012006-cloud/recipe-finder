console.log("favorites.js loaded");



let currentUser =
JSON.parse(localStorage.getItem("currentUser"));

let favoriteContainer =
document.getElementById("favoriteContainer");

if(!currentUser){

    alert("Please login first");

    window.location.href="login.html";

}







async function loadFavorites(){


    try{


        let response = await fetch(

    "http://localhost:5000/api/favorites",

    {
        headers:{
            "Authorization":
            "Bearer " + localStorage.getItem("token")
        }
    }

);


        let favorites = await response.json();


        console.log("Favorites:", favorites);



        if(favorites.length === 0){


            favoriteContainer.innerHTML = `

            <h3>
            No saved recipes yet ❤️
            </h3>

            `;

            return;

        }



        let recipeResponse =
        await fetch(
            "http://localhost:5000/api/recipes"
        );


        let recipes =
        await recipeResponse.json();



        favoriteContainer.innerHTML = "";



        favorites.forEach(favorite=>{


            let recipe =
recipes.find(r =>
    String(r._id) === String(favorite.recipeId)
);

console.log("Favorite ID:", favorite.recipeId);
console.log("Found recipe:", recipe);

            if(recipe){


favoriteContainer.innerHTML += `

<div class="card">

<img src="${recipe.image}">

<h2>
${recipe.name}
</h2>


<div class="favorite-buttons">

<button onclick="viewRecipe('${recipe._id}')">

View Recipe

</button>


<button onclick="removeFavorite('${recipe._id}')">

Remove ❤️

</button>


</div>

</div>

`;


            }



        });



    }

    catch(error){

        console.log(error);

    }


}



function viewRecipe(recipeId){

    localStorage.setItem(
        "selectedRecipe",
        recipeId
    );

    window.location.href="recipe.html";

}

async function removeFavorite(recipeId){

    let confirmRemove =
    confirm("Remove this recipe from favorites?");


    if(!confirmRemove){
        return;
    }


    let response = await fetch(

        "http://localhost:5000/api/favorites/"
        +
        recipeId,

        {

            method:"DELETE",

            headers:{
                "Authorization":
                "Bearer " + localStorage.getItem("token")
            }

        }

    );


    let data = await response.json();


    console.log("Remove response:", data);


    if(response.ok){

        alert("Removed from favorites ❤️");

        loadFavorites();

    }
    else{

        alert(data.message || data.error);

    }

}

loadFavorites();