alert("JavaScript is working!");

let recipes = [];
let currentUser =
JSON.parse(localStorage.getItem("currentUser"));
async function loadRecipes(){

    try{

        let response = await fetch(
            "https://recipe-finder-gdak.onrender.com/api/recipes"
        );


        recipes = await response.json();


        displayRecipes(recipes);


    }
    catch(error){

        console.log(error);

    }

}


loadRecipes();

const container = document.getElementById("recipeContainer");


function displayRecipes(recipeList){


    container.innerHTML = "";


    if(recipeList.length === 0){

        container.innerHTML = `

        <div class="no-result">

            <h2>
            😔 No recipes found
            </h2>


            <p>
            Try searching another recipe or ingredient
            </p>


        </div>

        `;


        return;

    }


    recipeList.forEach(recipe => {

        container.innerHTML += `
        <div class="card">

            <img src="${recipe.image}">

            <h3>${recipe.name}</h3>

           <p>${recipe.category}</p>

            <button onclick="viewRecipe('${recipe._id}')">
    View Recipe
</button>

        </div>
        `;

    });

}


// Show all recipes initially
displayRecipes(recipes);

function applyFilters(){

let category =
document.getElementById("categoryFilter").value;


let difficulty =
document.getElementById("difficultyFilter").value;


let rating =
document.getElementById("ratingFilter").value;
let food =
document.getElementById("foodFilter").value;

let time =
document.getElementById("timeFilter").value;



let filtered = recipes.filter(recipe=>{


let matchCategory =
category==="" ||
recipe.category===category;



let matchDifficulty =
difficulty==="" ||
recipe.difficulty===difficulty;



let matchRating =
rating==="" ||
recipe.rating >= Number(rating);

let matchFood =
food==="" ||
recipe.foodType===food;

// cooking time filter
let recipeTime =
parseInt(recipe.time);



let matchTime =
time==="" ||
recipeTime <= Number(time);



return matchCategory &&
matchDifficulty &&
matchRating &&
matchTime &&
matchFood;


});


displayRecipes(filtered);

}

function searchRecipe(){

    let searchText =
    document.getElementById("searchInput")
    .value
    .toLowerCase();



    let result = recipes.filter(recipe => {


        let nameMatch =
        recipe.name
        .toLowerCase()
        .includes(searchText);



        let ingredientMatch =
        recipe.ingredients.some(item =>
            item.toLowerCase().includes(searchText)
        );


        return nameMatch || ingredientMatch;


    });



    displayRecipes(result);


}

function showSuggestions(){

    let input =
    document.getElementById("searchInput")
    .value
    .toLowerCase()
    .trim();


    let suggestionBox =
    document.getElementById("suggestions");


    suggestionBox.innerHTML="";


    if(input===""){
        return;
    }


    let matches = recipes.filter(recipe =>

        recipe.name
        .toLowerCase()
        .includes(input)

    );


    matches.slice(0,5).forEach(recipe=>{


        suggestionBox.innerHTML += `

        <div class="suggestion"
        onclick="selectSuggestion('${recipe.name}')">

        🍽 ${recipe.name}

        </div>

        `;


    });


}

function selectSuggestion(name){

    document.getElementById("searchInput").value=name;

    document.getElementById("suggestions").innerHTML="";

    searchRecipe();

}
function viewRecipe(recipeId) {

    // Remove old recipe selections
    localStorage.removeItem("selectedRecipe");
    localStorage.removeItem("selectedRecipeId");

    // Store the recipe selected from MAIN PAGE
    localStorage.setItem(
        "selectedRecipeId",
        recipeId
    );

    window.location.href = "recipe.html";
}

function showSuggestions(){

    let input =
    document.getElementById("searchInput")
    .value
    .toLowerCase();


    let suggestionBox =
    document.getElementById("suggestions");


    suggestionBox.innerHTML = "";


    if(input === ""){

        return;

    }


    let results = recipes.filter(recipe =>

        recipe.name
        .toLowerCase()
        .includes(input)

    );



    results.slice(0,5).forEach(recipe=>{


        suggestionBox.innerHTML += `

        <div 
        class="suggestion-item"
        onclick="selectSuggestion('${recipe.name}')">

        🍽 ${recipe.name}

        </div>

        `;


    });


}

function selectSuggestion(name) {

    let recipe = recipes.find(r =>
        r.name === name
    );

    if (recipe) {

        localStorage.removeItem("selectedRecipe");
        localStorage.removeItem("selectedRecipeId");

        localStorage.setItem(
            "selectedRecipeId",
            recipe._id
        );

        window.location.href = "recipe.html";
    }
}

function clearSearch(){

    document.getElementById("searchInput").value="";


    document.getElementById("suggestions").innerHTML="";


    displayRecipes(recipes);

}


function resetFilters(){

    document.getElementById("categoryFilter").value="";
    
    document.getElementById("difficultyFilter").value="";
    
    document.getElementById("ratingFilter").value="";
    
    document.getElementById("timeFilter").value="";
    
    document.getElementById("foodFilter").value="";


    displayRecipes(recipes);

}

function toggleDarkMode(){

    document.body.classList.toggle("dark");


    if(document.body.classList.contains("dark")){

        localStorage.setItem(
            "darkMode",
            "enabled"
        );

    }

    else{

        localStorage.setItem(
            "darkMode",
            "disabled"
        );

    }

}



// Load saved theme

if(localStorage.getItem("darkMode") === "enabled"){

    document.body.classList.add("dark");

}


function checkAdminAccess(){

    let currentUser =
        JSON.parse(
            localStorage.getItem("currentUser")
        );


    if(
        currentUser &&
        currentUser.role === "admin"
    ){

        document.getElementById(
            "adminDashboardBtn"
        ).style.display = "block";

    }

}


function openAdminDashboard(){

    window.location.href = "admin.html";

}


checkAdminAccess();



function askKitchenAI(){

    let input =
        document.getElementById("kitchenInput").value;

    let result =
        document.getElementById("kitchenResult");

    result.innerHTML =
        `<p>You entered: ${input}</p>`;

}

function openKitchenAI(){

    window.location.href = "kitchen-ai.html";

}



