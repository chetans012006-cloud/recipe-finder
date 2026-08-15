console.log("myReviews.js loaded");


let currentUser =
JSON.parse(localStorage.getItem("currentUser"));



let reviewsContainer =
document.getElementById("reviewsContainer");



async function loadMyReviews(){


try{


let commentResponse = await fetch(

"https://recipe-finder-gdak.onrender.com/api/comments/user/"
+ currentUser.id

);


let comments = await commentResponse.json();




let recipeResponse = await fetch(

"https://recipe-finder-gdak.onrender.com/api/recipes"

);


let recipes = await recipeResponse.json();



console.log("Comments:",comments);




if(comments.length===0){


reviewsContainer.innerHTML = `

<h3>
No reviews yet 💬
</h3>

`;

return;

}



reviewsContainer.innerHTML="";



comments.forEach(comment=>{


let recipe = comment.recipeId;



if(recipe){


reviewsContainer.innerHTML += `


<div class="card">


<img src="${recipe.image}">


<h2>
${recipe.name}
</h2>


<p>
💬 ${comment.text}
</p>


<p>
👍 Likes: ${comment.likes}
</p>


<p>
📅 ${new Date(comment.createdAt)
.toLocaleDateString()}
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
        "selectedRecipeId",
        id
    );

    localStorage.removeItem(
        "selectedRecipe"
    );

    window.location.href="recipe.html";

}



loadMyReviews();