let adminRecipes = [];

let currentUser =
    JSON.parse(
        localStorage.getItem("currentUser")
    );


if(
    !currentUser ||
    currentUser.role !== "admin"
){

    alert("Access denied ❌");

    window.location.href = "index.html";
}
function displayAdminRecipes(recipes){

    let container =
        document.getElementById("adminRecipes");

    container.innerHTML = "";

    recipes.forEach(recipe => {

        container.innerHTML += `

            <div class="admin-recipe-card">

                <h3>${recipe.name}</h3>

                <img
                    src="${recipe.image}"
                    width="150"
                >

                <p>Category: ${recipe.category}</p>

                <button
                    onclick="editRecipe('${recipe._id}')"
                >
                    ✏️ Edit Recipe
                </button>

                <button
                    onclick="deleteRecipe('${recipe._id}')"
                >
                    Delete Recipe ❌
                </button>

            </div>

        `;

    });
}

async function loadAdminRecipes(){

    let response = await fetch(
        "https://recipe-finder-gdak.onrender.com/api/api/admin/recipes",
        {
            headers:{
                "Authorization":
                "Bearer " + localStorage.getItem("token")
            }
        }
    );

    adminRecipes = await response.json();

    displayAdminRecipes(adminRecipes);
}





function searchAdminRecipes(){

    let search =
        document.getElementById("recipeSearch")
        .value
        .toLowerCase()
        .trim();

    let filteredRecipes =
        adminRecipes.filter(recipe =>
            recipe.name
            .toLowerCase()
            .includes(search)
        );

    displayAdminRecipes(filteredRecipes);
}

async function deleteRecipe(id){


let confirmDelete =
confirm(
"Delete this recipe?"
);



if(!confirmDelete){

return;

}



let response =
await fetch(

"https://recipe-finder-gdak.onrender.com/api/api/admin/recipe/"
+
id,

{

method:"DELETE",

headers:{

"Authorization":
"Bearer " + localStorage.getItem("token")

}

}

);



let data =
await response.json();



alert(data.message);



loadAdminRecipes();


}



loadAdminRecipes();
async function editRecipe(id){

    let response = await fetch(
        "https://recipe-finder-gdak.onrender.com/api/api/admin/recipes",
        {
            headers:{
                "Authorization":
                "Bearer " + localStorage.getItem("token")
            }
        }
    );

    let recipes = await response.json();

    let recipe = recipes.find(r => r._id === id);

    let container =
    document.getElementById("editRecipeForm");


    // Create step fields
    let stepHTML = "";

    recipe.steps.forEach((step,index)=>{

        stepHTML += `

            <div class="edit-step">

                <h3>Step ${index + 1}</h3>

                <textarea
                    id="editStepDescription${index}"
                    placeholder="Step description"
                >${step.description || ""}</textarea>

                <br>

                ${
                    step.image
                    ?
                    `<p>Current Step Image:</p>
                     <img
                        src="${step.image}"
                        width="150"
                    >`
                    :
                    `<p>No step image</p>`
                }

                <br>

                <input
                    type="file"
                    id="editStepImage${index}"
                    accept="image/*"
                >

                <br><br>

            </div>

        `;
    });


    container.innerHTML = `

        <h2>✏️ Edit Recipe</h2>


        <input
            id="editName"
            value="${recipe.name}"
            placeholder="Recipe name"
        >

        <br><br>


        <p>Current Recipe Image:</p>

        <img
            src="${recipe.image}"
            width="200"
        >

        <br><br>


        <input
            type="file"
            id="editImage"
            accept="image/*"
        >

        <br><br>


        <input
            id="editCategory"
            value="${recipe.category}"
            placeholder="Category"
        >

        <br><br>


        <input
            id="editDifficulty"
            value="${recipe.difficulty}"
            placeholder="Difficulty"
        >

        <br><br>


        <input
            id="editTime"
            value="${recipe.time}"
            placeholder="Cooking time"
        >

        <br><br>


        <input
            id="editServings"
            type="number"
            value="${recipe.servings}"
            placeholder="Servings"
        >

        <br><br>


        <input
            id="editFoodType"
            value="${recipe.foodType}"
            placeholder="Veg / Non-Veg"
        >

        <br><br>


        <h3>Ingredients</h3>

<textarea
    id="editIngredients"
    placeholder="Ingredients - one per line"
>${recipe.ingredients.join("\n")}</textarea>

<br><br>

<h3>💡 Chef Tips</h3>

<textarea
    id="editChefTips"
    placeholder="Chef tips - one per line"
>${(recipe.chefTips || []).join("\n")}</textarea>

<br><br>

<h3>Steps</h3>

       

        ${stepHTML}


        <button
            onclick="saveEditedRecipe('${id}')"
        >
            💾 Save Changes
        </button>


        <button onclick="cancelEdit()">
            ❌ Cancel
        </button>

    `;

    container.scrollIntoView({
    behavior: "smooth",
    block: "start"
});
}

async function saveEditedRecipe(id){

    let ingredients =
        document.getElementById("editIngredients")
        .value
        .split("\n")
        .filter(x => x.trim());

        let chefTips =
    document.getElementById("editChefTips")
    .value
    .split("\n")
    .filter(x => x.trim());


    // Create FormData
    let formData = new FormData();


    formData.append(
        "name",
        document.getElementById("editName").value
    );


    formData.append(
        "category",
        document.getElementById("editCategory").value
    );


    formData.append(
        "difficulty",
        document.getElementById("editDifficulty").value
    );


    formData.append(
        "time",
        document.getElementById("editTime").value
    );


    formData.append(
        "servings",
        document.getElementById("editServings").value
    );


    formData.append(
        "foodType",
        document.getElementById("editFoodType").value
    );


    formData.append(
        "ingredients",
        JSON.stringify(ingredients)
    );
    
    formData.append(
    "chefTips",
    JSON.stringify(chefTips)
);

console.log("CHEF TIPS BEFORE SEND:", chefTips);
console.log(
    "FORMDATA CHEF TIPS:",
    formData.get("chefTips")
);

    // Main recipe image
    let recipeImage =
        document.getElementById("editImage").files[0];


    if(recipeImage){

        formData.append(
            "image",
            recipeImage
        );

    }


    // Step descriptions + existing images
    let stepDescriptions = [];


    let stepImageIndexes = [];


    document
        .querySelectorAll(".edit-step")
        .forEach((stepElement,index)=>{

            let description =
                document.getElementById(
                    "editStepDescription" + index
                ).value;


            stepDescriptions.push(description);


            let stepImage =
                document.getElementById(
                    "editStepImage" + index
                ).files[0];


            if(stepImage){

                formData.append(
                    "stepImages",
                    stepImage
                );


                stepImageIndexes.push(index);

            }

        });


    formData.append(
        "stepDescriptions",
        JSON.stringify(stepDescriptions)
    );


    formData.append(
        "stepImageIndexes",
        JSON.stringify(stepImageIndexes)
    );


    let response = await fetch(

        "https://recipe-finder-gdak.onrender.com/api/api/admin/recipe/" + id,

        {

            method:"PUT",

            headers:{

                "Authorization":
                "Bearer " +
                localStorage.getItem("token")

            },

            body:formData

        }

    );


    let data =
        await response.json();


    console.log(data);


    if(response.ok){

        alert(
            "Recipe updated successfully ✅"
        );


        cancelEdit();

        loadAdminRecipes();

    }

    else{

        alert(
            data.error ||
            data.message ||
            "Failed to update recipe"
        );

    }

}

async function loadReportedComments(){

    let response = await fetch(
        "https://recipe-finder-gdak.onrender.com/api/api/admin/reported-comments",
        {
            headers:{
                "Authorization":
                "Bearer " + localStorage.getItem("token")
            }
        }
    );


    let comments = await response.json();


    let container =
    document.getElementById("reportedComments");


    if(comments.length === 0){

        container.innerHTML =
        "<p>No reported comments 🎉</p>";

        return;

    }


    container.innerHTML="";


    comments.forEach(comment=>{


        container.innerHTML += `

        <div class="admin-comment-card">

            <h3>
            User: ${comment.userId.username}
            </h3>


            <p>
            "${comment.text}"
            </p>


            <p>
            Reports: ${comment.reportCount}
            </p>


            <button onclick="deleteReportedComment('${comment._id}')">

            Remove Comment ❌

            </button>


        </div>

        `;


    });


}

async function deleteReportedComment(id){


let confirmDelete =
confirm("Delete this reported comment?");


if(!confirmDelete){
    return;
}



let response = await fetch(

"https://recipe-finder-gdak.onrender.com/api/api/admin/comment/"+id,

{

method:"DELETE",

headers:{

"Authorization":

"Bearer " + localStorage.getItem("token")

}

}

);



let data = await response.json();


alert(data.message);


loadReportedComments();


}

loadAdminStats();

loadAdminRecipes();

loadReportedComments();

loadAdminUsers();

function showAddRecipeForm(){

    let container =
    document.getElementById("recipeForm");


    container.innerHTML = `

        <h2>➕ Add New Recipe</h2>

        <input
            id="recipeName"
            placeholder="Recipe name"
        >

        <br><br>

        <input
type="file"
id="recipeImage"
accept="image/*"
>

        <br><br>

        <input
            id="recipeCategory"
            placeholder="Category"
        >

        <br><br>

        <input
            id="recipeDifficulty"
            placeholder="Difficulty"
            value="Easy"
        >

        <br><br>

        <input
            id="recipeTime"
            placeholder="Time"
            value="30 mins"
        >

        <br><br>

        <input
            id="recipeServings"
            type="number"
            placeholder="Servings"
            value="1"
        >

        <br><br>

        <input
            id="recipeFoodType"
            placeholder="Veg / Non-Veg"
        >

        <br><br>

        <textarea
            id="recipeIngredients"
            placeholder="Ingredients - one per line"
        ></textarea>

        <br><br>

<h3>💡 Chef Tips</h3>

<textarea
    id="recipeChefTips"
    placeholder="Chef tips - one per line"
></textarea>

<br><br>

        <br><br>

        <h3>📝 Steps</h3>

<div id="stepContainer">

    <div class="step-input">

        <input
            type="text"
            class="stepDescription"
            placeholder="Step 1 description"
        >

        <br><br>

        <input
            type="file"
            class="stepImage"
            accept="image/*"
        >

    </div>

</div>

<br>

<button type="button" onclick="addStepInput()">
    ➕ Add Another Step
</button>

        <br><br>

        <button onclick="addRecipe()">
            💾 Save Recipe
        </button>

        <button onclick="cancelRecipeForm()">
            Cancel
        </button>

    `;

}
function addStepInput(){

    let container =
        document.getElementById("stepContainer");


    let stepNumber =
        container.children.length + 1;


    container.innerHTML += `

        <div class="step-input">

            <hr>

            <h4>
                Step ${stepNumber}
            </h4>

            <input
                type="text"
                class="stepDescription"
                placeholder="Step ${stepNumber} description"
            >

            <br><br>

            <input
                type="file"
                class="stepImage"
                accept="image/*"
            >

        </div>

    `;

}

async function addRecipe(){

    let name =
    document.getElementById("recipeName").value;

    let image =
    document.getElementById("recipeImage").value;

    let category =
    document.getElementById("recipeCategory").value;

    let difficulty =
    document.getElementById("recipeDifficulty").value;

    let time =
    document.getElementById("recipeTime").value;

    let servings =
    Number(
        document.getElementById("recipeServings").value
    );

    let foodType =
    document.getElementById("recipeFoodType").value;

    let ingredients =
    document.getElementById("recipeIngredients")
    .value
    .split("\n")
    .filter(x => x.trim() !== "");

    let chefTips =
document.getElementById("recipeChefTips")
.value
.split("\n")
.filter(x => x.trim() !== "");


    let stepDescriptions =
    document.querySelectorAll(".stepDescription");

let stepImages =
    document.querySelectorAll(".stepImage");

let stepDescriptionArray = [];

stepDescriptions.forEach(input => {
    stepDescriptionArray.push(input.value.trim());
});


let steps = [];

stepDescriptions.forEach((input,index)=>{

    let description =
        input.value.trim();


    if(description !== ""){

        steps.push({

            title: "Step",

            description: description,

            image: "",

            time: 0

        });

    }

});


    

let formData = new FormData();


formData.append("name", name);

formData.append("category", category);

formData.append("difficulty", difficulty);

formData.append("time", time);

formData.append("servings", servings);

formData.append("foodType", foodType);


formData.append(
    "ingredients",
    JSON.stringify(ingredients)
);

formData.append(
    "chefTips",
    JSON.stringify(chefTips)
);

formData.append(
    "stepDescriptions",
    JSON.stringify(stepDescriptionArray)
);



let imageFile =
document.getElementById("recipeImage").files[0];


formData.append(
    "image",
    imageFile
);

let stepImageIndexes = [];

stepImages.forEach((input,index)=>{

    if(input.files[0]){

        formData.append(
            "stepImages",
            input.files[0]
        );

        stepImageIndexes.push(index);

    }

});

formData.append(
    "stepImageIndexes",
    JSON.stringify(stepImageIndexes)
);

    let response = await fetch(
"https://recipe-finder-gdak.onrender.com/api/api/admin/recipe",
{

method:"POST",

headers:{


"Authorization":
"Bearer " + localStorage.getItem("token")


},

body:formData

});


    let data = await response.json();


    if(response.ok){

        alert("Recipe added successfully ✅");

        document.getElementById("recipeForm")
        .innerHTML = "";

        loadAdminRecipes();

    }
    else{

        alert(data.message || data.error);

    }

}

function cancelRecipeForm(){

    document.getElementById("recipeForm")
    .innerHTML = "";

}

function cancelEdit(){

document.getElementById(
"editRecipeForm"
).innerHTML="";

}

async function loadAdminStats(){


let response =
await fetch(

"https://recipe-finder-gdak.onrender.com/api/api/admin/stats",

{

headers:{

"Authorization":

"Bearer "+localStorage.getItem("token")

}

}

);



let stats =
await response.json();



document.getElementById(
"adminStats"
).innerHTML = `


<div class="stat-box">


<h2>
📊 Dashboard Overview
</h2>


<p>
🍽 Total Recipes:
<b>${stats.totalRecipes}</b>
</p>


<p>
👥 Total Users:
<b>${stats.totalUsers}</b>
</p>


<p>
💬 Total Reviews:
<b>${stats.totalComments}</b>
</p>


<p>
🚨 Reported Comments:
<b>${stats.reportedComments}</b>
</p>


</div>


`;



}


async function loadAdminUsers(){

let response = await fetch(

"https://recipe-finder-gdak.onrender.com/api/api/admin/users",

{

headers:{

"Authorization":
"Bearer "+localStorage.getItem("token")

}

}

);


let users = await response.json();


let container =
document.getElementById("adminUsers");


container.innerHTML="";


users.forEach(user=>{


container.innerHTML += `


<div class="admin-user-card">


<h3>
${user.username}
</h3>


<p>
📧 ${user.email}
</p>


<p>
Role: ${user.role || "user"}
</p>


<p>
Joined:
${new Date(user.createdAt).toLocaleDateString()}
</p>



<button onclick="changeRole('${user._id}','admin')">

Make Admin 👑

</button>



<button onclick="changeRole('${user._id}','user')">

Remove Admin

</button>



<button onclick="deleteUser('${user._id}')">

Delete User ❌

</button>



</div>


<hr>


`;


});


}

async function changeRole(id,role){


let response = await fetch(

"https://recipe-finder-gdak.onrender.com/api/api/admin/user/"+id+"/role",

{

method:"PUT",

headers:{

"Content-Type":"application/json",

"Authorization":
"Bearer "+localStorage.getItem("token")

},

body:JSON.stringify({

role:role

})

}

);



let data = await response.json();


alert(data.message);


loadAdminUsers();


}

async function deleteUser(id){


let confirmDelete =
confirm(
"Delete this user?"
);


if(!confirmDelete){
return;
}



let response = await fetch(

"https://recipe-finder-gdak.onrender.com/api/api/admin/user/"+id,

{

method:"DELETE",

headers:{

"Authorization":
"Bearer "+localStorage.getItem("token")

}

}

);



let data =
await response.json();


alert(data.message);


loadAdminUsers();


}