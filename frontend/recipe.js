console.log("recipe.js loaded");


let selectedRecipeId =
    localStorage.getItem("selectedRecipeId");


let recipe;
// Cooking Mode Timer Variables

let currentStepIndex = 0;

let timerSeconds = 0;

let timerInterval = null;

let timerRunning = false;

let currentUser =
JSON.parse(localStorage.getItem("currentUser"));
let openedReplyBoxes =
JSON.parse(localStorage.getItem("openedReplyBoxes")) || [];



if(!currentUser){

    alert("Please login first");

    window.location.href="login.html";

}

function displayRecipe(){

    document.getElementById("recipeImage").src =
    recipe.image;


    document.getElementById("recipeName").innerHTML =
    recipe.name;


    // Ingredients

    let ingredientBox =
    document.getElementById("ingredients");

    ingredientBox.innerHTML = "";


    recipe.ingredients.forEach(item => {

        let li = document.createElement("li");

        li.innerHTML = item;

        ingredientBox.appendChild(li);

    });
// Cooking Procedure

let stepsBox =
document.getElementById("steps");

stepsBox.innerHTML = "";


recipe.steps.forEach((step,index)=>{

let div=document.createElement("div");

div.className="step";


div.innerHTML=`

<h3>
${step.title}
</h3>


<img src="${step.image}" class="step-image">


<p>
${step.description}
</p>


<span>
⏱ ${Math.floor(step.time/60)} mins
</span>

`;


stepsBox.appendChild(div);


});

    // Basic details

    document.getElementById("rating").innerHTML =
"Loading...";


    document.getElementById("time").innerHTML =
    recipe.time || "N/A";


    document.getElementById("difficulty").innerHTML =
    recipe.difficulty || "Easy";


    document.getElementById("servings").innerHTML =
    recipe.servings || 1;


    // Nutrition

    document.getElementById("nutrition").innerHTML = `

    <p>Calories: ${recipe.nutrition?.calories || 0}</p>

    <p>Protein: ${recipe.nutrition?.protein || 0}</p>

    <p>Carbs: ${recipe.nutrition?.carbs || 0}</p>

    <p>Fat: ${recipe.nutrition?.fat || 0}</p>

    `;


    // Chef tips

    let tipsBox =
    document.getElementById("tips");

    tipsBox.innerHTML = "";


    (recipe.chefTips || []).forEach(tip => {

        let li = document.createElement("li");

        li.innerHTML = tip;

        tipsBox.appendChild(li);

    });

}

async function loadRecipe() {

    try {

        let response;
        let data;

        // =========================
        // LOAD RECIPE BY ID
        // =========================

        if (selectedRecipeId) {

            console.log(
                "Loading recipe by ID:",
                selectedRecipeId
            );

            response = await fetch(
                "https://recipe-finder-gdak.onrender.com/api/recipes/" +
                selectedRecipeId
            );

        }

        // =========================
        // OLD NAME SYSTEM
        // =========================

        

        // =========================
        // NOTHING SELECTED
        // =========================

        else {

            alert("Recipe not selected.");

            window.location.href = "index.html";

            return;
        }


        data = await response.json();


        if (!response.ok) {

            alert(
                data.error ||
                "Recipe not found"
            );

            window.location.href = "index.html";

            return;
        }


        recipe = data;


        console.log(
            "Recipe loaded:",
            recipe
        );


        // =========================
        // DISPLAY RECIPE
        // =========================

        displayRecipe();


        // =========================
        // RATINGS
        // =========================

        showAverageRating();

        restoreUserRating();


        // =========================
        // FAVORITES
        // =========================

        checkFavoriteStatus();


        // =========================
        // COMMENTS
        // =========================

        displayComments();

    }

    catch (error) {

        console.error(
            "Recipe loading error:",
            error
        );

    }
}






async function addReview(){

    let text = document.getElementById("userReview").value;


    if(text === ""){

        alert("Please enter comment");

        return;

    }


    try{


        let response = await fetch(
        "https://recipe-finder-gdak.onrender.com/api/comments",
        {

            method:"POST",

            headers:{

"Content-Type":"application/json",

"Authorization":
"Bearer "+localStorage.getItem("token")

},

            body:JSON.stringify({


    userId: currentUser.id,

    recipeId: recipe._id,

    

    text: text,

    likes:0,

    likedBy:[],

    reportCount:0,

    reportedBy:[],

    replies:[]

})

        });


        let data = await response.json();


        if(response.ok){

            alert("Comment added");


            document.getElementById("userReview").value="";


            displayComments();

        }
        else{

            alert(data.error);

        }


    }
    catch(error){

        console.log(error);

    }

}

function getRelativeTime(timestamp){

    const now = Date.now();

    const seconds = Math.floor((now - timestamp) / 1000);

    if(seconds < 10){

    return "Just now";

}

if(seconds < 60){

    return seconds + " seconds ago";

}

    const minutes = Math.floor(seconds / 60);

    if(minutes < 60){

        return minutes + (minutes === 1 ? " minute ago" : " minutes ago");

    }

    const hours = Math.floor(minutes / 60);

    if(hours < 24){

        return hours + (hours === 1 ? " hour ago" : " hours ago");

    }

    const days = Math.floor(hours / 24);

    if(days === 1){

        return "Yesterday";

    }

    if(days < 7){

        return days + " days ago";

    }

    return new Date(timestamp).toLocaleDateString();

}
function restoreOpenedReplies(){


openedReplyBoxes.forEach(id=>{


let button =
document.querySelector(`button[data-id="${id}"]`);


if(button){


let box =
button.parentElement.querySelector(".nested-replies");


if(box){

box.style.display="block";


button.innerHTML =
"▲ Hide " + button.dataset.count + " replies";


}

}


});


}
// Show comments

async function displayComments(commentList = null){

    let comments = [];


if(commentList){

    comments = commentList;

}
else{

    let response = await fetch(
        "https://recipe-finder-gdak.onrender.com/api/comments/" + recipe._id
    );

    comments = await response.json();
    console.log("COMMENTS DATA:", comments);

}
comments.sort((a,b)=>{

    return b.pinned - a.pinned;

});

    let box = document.getElementById("reviews");

    box.innerHTML = "";


    comments.forEach((comment,index)=>{


        box.innerHTML += `

        <div class="single-review">

            <div class="user-info">

<img 
src="${comment.userId?.profilePic || 'images/default-profile.png'}"
class="profile-img">

<h3>
${comment.userId?.username || "Deleted User"}

${comment.pinned ? " 📌 Pinned" : ""}

</h3>

</div>

            <p>${comment.text}</p>


            <small>
🕒 ${getRelativeTime(comment.createdAt)}

${
comment.editedAt ?

" • Edited " + getRelativeTime(comment.editedAt)

:

""

}

</small>

            <br><br>


           <button 
onclick="likeComment('${comment._id}')"
class="${comment.likedBy?.includes(currentUser.id) ? 'liked-btn' : ''}">

${comment.likedBy?.includes(currentUser.id) ? "❤️" : "👍"} ${comment.likes}

</button>


            <button onclick="replyComment(${index})">

            💬 Reply

            </button>
            ${
comment.userId?._id === currentUser.id ?

`

<button onclick="editComment('${comment._id}', \`${comment.text}\`)">

✏️ Edit

</button>

<button onclick="deleteComment('${comment._id}')">

🗑 Delete

</button>

<button onclick="pinComment('${comment._id}')">

${comment.pinned ? "📌 Unpin" : "📌 Pin"}

</button>

`

:

`

<button onclick="reportComment('${comment._id}')">

🚩 Report (${comment.reportCount || 0})

</button>

`

}

            <div class="replies">


            ${
            comment.replies.length > 0 ?

            `

            <button 
            onclick="toggleReplies(this)"
            data-id="comment-${index}"
            data-count="${countReplies(comment.replies)}">

            💬 View ${countReplies(comment.replies)} more replies

            </button>

            `

            :

            ""

            }


            <div class="nested-replies">

            ${showReplies(comment.replies, comment._id, [])}

            </div>


            </div>


        </div>


        `;


    });


    restoreOpenedReplies();

}


async function sortComments(){

    let sortType =
    document.getElementById("sortComments").value;


    let response = await fetch(
        "https://recipe-finder-gdak.onrender.com/api/comments/" + recipe._id
    );


    let comments = await response.json();



    if(sortType === "newest"){

        comments.sort(
            (a,b)=> new Date(b.createdAt) - new Date(a.createdAt)
        );

    }


    else if(sortType === "oldest"){

        comments.sort(
            (a,b)=> new Date(a.createdAt) - new Date(b.createdAt)
        );

    }


    else if(sortType === "liked"){

        comments.sort(
            (a,b)=> b.likes - a.likes
        );

    }


    displayComments(comments);

}



// Like system

async function likeComment(id){


    let currentUser =
    JSON.parse(localStorage.getItem("currentUser"));



    if(!currentUser){

        alert("Please login first");

        return;

    }



    let response =
    await fetch(

        "https://recipe-finder-gdak.onrender.com/api/comments/like/" + id,

        {

            method:"PUT",

           headers:{

"Content-Type":"application/json",

"Authorization":
"Bearer "+localStorage.getItem("token")

},


           body:JSON.stringify({

    userId: currentUser.id

})

        }

    );



    let data =
    await response.json();



    console.log("Like response:",data);



    displayComments();


}

async function likeReply(commentId, replyId){


    let currentUser =
    JSON.parse(localStorage.getItem("currentUser"));



    if(!currentUser){

        alert("Please login first");

        return;

    }



    let response =
    await fetch(

        "https://recipe-finder-gdak.onrender.com/api/comments/reply/like/" +
        commentId +
        "/" +
        replyId,

        {

            method:"PUT",

           headers:{

"Content-Type":"application/json",

"Authorization":
"Bearer "+localStorage.getItem("token")

},

          body:JSON.stringify({

    userId: currentUser.id

})

        }

    );



    let data =
    await response.json();


    console.log(
    "Reply like response:",
    data
);


let button = document.getElementById(
    "reply-like-" + replyId
);


if(button){

    let liked =
    data.reply.likedBy.includes(currentUser.id);


    button.innerHTML =
    `${liked ? "❤️" : "👍"} ${data.reply.likes}`;


    if(liked){

        button.classList.add("liked-btn");

    }
    else{

        button.classList.remove("liked-btn");

    }

}


}

// Reply system

async function replyComment(index){


    let reply = prompt("Write your reply");


    if(reply === null || reply === ""){

        return;

    }


    let commentsResponse = await fetch(
        "https://recipe-finder-gdak.onrender.com/api/comments/" + recipe._id
    );


    let comments = await commentsResponse.json();


    let comment = comments[index];


    let response = await fetch(
"https://recipe-finder-gdak.onrender.com/api/comments/reply/" + comment._id,
{

method:"POST",

headers:{

"Content-Type":"application/json",

"Authorization":
"Bearer "+localStorage.getItem("token")

},

            body:JSON.stringify({

    userId: currentUser.id,

    text: reply,

    replyTo: comment.userId.username,

    likes:0,

    reportCount:0,

    replies:[]

})
        }
    );


    let data = await response.json();


    if(response.ok){

        alert("Reply added");

        displayComments();

    }
    else{

        alert(data.error);

    }

}





async function deleteComment(id){


    let confirmDelete = confirm(
        "Delete this comment?"
    );


    if(!confirmDelete){
        return;
    }


    let response = await fetch(
        "https://recipe-finder-gdak.onrender.com/api/comments/" + id,
        {
            method:"DELETE"
        }
    );


    let data = await response.json();


    if(response.ok){

        alert("Comment deleted");

        displayComments();

    }
    else{

        alert(data.error);

    }


}
async function editComment(id, oldText){


    let newText = prompt(
        "Edit your comment:",
        oldText
    );


    if(newText === null || newText === ""){

        return;

    }


    let response = await fetch(
        "https://recipe-finder-gdak.onrender.com/api/comments/" + id,
        {

            method:"PUT",

            headers:{

"Content-Type":"application/json",

"Authorization":
"Bearer "+localStorage.getItem("token")

},

            body:JSON.stringify({

                text:newText

            })

        }
    );


    let data = await response.json();


    if(response.ok){

        alert("Comment updated");

        displayComments();

    }
    else{

        alert(data.error);

    }


}

async function editReply(commentId, replyId, oldText){

    let newText = prompt(
        "Edit your reply:",
        oldText
    );


    if(newText === null || newText === ""){
        return;
    }


    let response = await fetch(
        "https://recipe-finder-gdak.onrender.com/api/comments/reply/" 
        + commentId +
        "/" +
        replyId,
        {
            method:"PUT",

            headers:{

"Content-Type":"application/json",

"Authorization":
"Bearer "+localStorage.getItem("token")

},

            body:JSON.stringify({
                text:newText
            })
        }
    );


    let data = await response.json();


    if(response.ok){

        alert("Reply updated");

        displayComments();

    }
    else{

        alert(data.error);

    }

}



function deleteNestedReply(replies, targetIndex){


    replies.splice(targetIndex,1);


}



async function deleteReply(commentId, replyId){


    let confirmDelete = confirm(
        "Delete this reply?"
    );


    if(!confirmDelete){
        return;
    }


    let response = await fetch(
        "https://recipe-finder-gdak.onrender.com/api/comments/reply/"
        + commentId +
        "/" +
        replyId,
        {
            method:"DELETE"
        }
    );


    let data = await response.json();


    if(response.ok){

        alert("Reply deleted");

        displayComments();

    }
    else{

        alert(data.error);

    }

}

async function reportComment(id){


    let currentUser =
    JSON.parse(localStorage.getItem("currentUser"));


    let response = await fetch(

        "https://recipe-finder-gdak.onrender.com/api/comments/report/" + id,

        {

            method:"PUT",

            headers:{

"Content-Type":"application/json",

"Authorization":
"Bearer "+localStorage.getItem("token")

},

            body:JSON.stringify({})

        }

    );


    let data = await response.json();



    if(response.ok){


        alert(data.message);


        displayComments();


    }

    else{


        alert(data.error);


    }


}
async function reportReply(commentId, replyId){


    let currentUser =
    JSON.parse(localStorage.getItem("currentUser"));



    let response = await fetch(

        "https://recipe-finder-gdak.onrender.com/api/comments/reply/report/"
        + commentId +
        "/" +
        replyId,

        {

            method:"PUT",

            headers:{

"Content-Type":"application/json",

"Authorization":
"Bearer "+localStorage.getItem("token")

},

           body:JSON.stringify({})

        }

    );



    let data = await response.json();



    if(response.ok){


        alert(data.message);


        displayComments();


    }

    else{


        alert(data.error);


    }


}

async function replyToReply(commentId, replyId, username){
    let targetReplyId = replyId;

    let text = prompt("Write your reply");


    if(text === null || text === ""){
        return;
    }


    let response = await fetch(
        "https://recipe-finder-gdak.onrender.com/api/comments/reply/" 
        + commentId,
        {

            method:"POST",

            headers:{

"Content-Type":"application/json",

"Authorization":
"Bearer "+localStorage.getItem("token")

},

            body:JSON.stringify({

                userId: currentUser.id,

                text:text,

                replyTo:username,

                likes:0,

                reportCount:0,

                replies:[]

            })

        }
    );


    let data = await response.json();


   if(response.ok){

    alert("Reply added");

    await displayComments();


    setTimeout(()=>{

        let replyElement =
        document.querySelector(`[data-reply-id="${targetReplyId}"]`);


        if(replyElement){

            replyElement.scrollIntoView({
                behavior:"smooth",
                block:"center"
            });

        }


    },300);

}

}
function countReplies(replies){

    let count = replies.length;


    replies.forEach(reply => {

        if(reply.replies && reply.replies.length > 0){

            count += countReplies(reply.replies);

        }

    });


    return count;

}
// PASTE showReplies HERE


function showReplies(replies, commentId, path=[], show=true){
if(!show){

    return "";

}

    return replies.map((reply,replyIndex)=>{
    console.log("Nested Reply:", reply);    
    

        return `

       <div class="reply" data-reply-id="${reply._id}">
${
reply.replies && reply.replies.length > 0 ?

`

<button 
onclick="toggleReplies(this)" 
data-id="${commentId}-${[...path,replyIndex].join('-')}"
data-count="${countReplies(reply.replies)}">

💬 View ${countReplies(reply.replies)} more replies

</button>
`

:

""

}

          
           <div class="reply-content">

<div class="user-info">

<img 
src="${reply.userId?.profilePic || 'images/default-profile.png'}"
class="profile-img">

<b>${reply.userId?.username || "Deleted User"}</b>

</div>


<p>

↳ 
${
reply.replyTo 
? 
`<b>@${reply.replyTo}</b> `
:
""
}

${reply.text}

</p>
           <small>

🕒 ${
reply.createdAt 
? getRelativeTime(reply.createdAt)
: "Unknown date"
}

${reply.editedAt ?

" • Edited " + getRelativeTime(reply.editedAt)

:

""}

</small>


            <br>

           <button
id="reply-like-${reply._id}"
onclick="likeReply('${commentId}','${reply._id}')"
class="${reply.likedBy?.includes(currentUser.id) ? 'liked-btn' : ''}">

${reply.likedBy?.includes(currentUser.id) ? "❤️" : "👍"} ${reply.likes || 0}

</button>

            <button onclick="replyToReply('${commentId}','${reply._id}','${reply.userId?.username || "Deleted User"}')">

💬 Reply

</button>


${
reply.userId?._id === currentUser.id ?

`

<button onclick="editReply('${commentId}','${reply._id}','${reply.text}')">

✏️ Edit

</button>


<button onclick="deleteReply('${commentId}','${reply._id}')">

🗑 Delete

</button>

`

:

""

}


<button onclick="reportReply('${commentId}','${reply._id}')">

🚩 Report (${reply.reportCount || 0})

</button>


${
reply.replies && reply.replies.length > 0 ?

showReplies(
    reply.replies,
    commentId,
    []
)

:

""

}

        </div>

    </div>


        `;


    }).join("");

}

function toggleReplies(button){


    let repliesBox =
    button.closest(".replies")
    ?.querySelector(".nested-replies");


    if(!repliesBox){

        console.log("No replies box found");

        return;

    }



    let id = button.dataset.id;

    let count = button.dataset.count;



    if(repliesBox.style.display === "block"){


        repliesBox.style.display="none";


        openedReplyBoxes =
        openedReplyBoxes.filter(item=>item!==id);


        button.innerHTML =
        "💬 View " + count + " more replies";


    }

    else{


        repliesBox.style.display="block";


        if(!openedReplyBoxes.includes(id)){

            openedReplyBoxes.push(id);

        }


        button.innerHTML =
        "▲ Hide " + count + " replies";


    }



    localStorage.setItem(
        "openedReplyBoxes",
        JSON.stringify(openedReplyBoxes)
    );


}










async function rateRecipe(stars){


    try{


        let response = await fetch(
            "https://recipe-finder-gdak.onrender.com/api/ratings",
            {

                method:"POST",
headers:{

"Content-Type":"application/json",

"Authorization":
"Bearer "+localStorage.getItem("token")

},

                body:JSON.stringify({

userId: currentUser.id,

recipeId: recipe._id,

rating: stars

})

            }
        );



        let data = await response.json();
        
        if(data.message === "You already rated this recipe"){


    let updateResponse = await fetch(

        "https://recipe-finder-gdak.onrender.com/api/ratings/" + recipe._id,

        {

            method:"PUT",

            headers:{

"Content-Type":"application/json",

"Authorization":
"Bearer "+localStorage.getItem("token")

},

            body:JSON.stringify({

userId: currentUser.id,


                rating:stars

            })

        }

    );


    let updateData =
    await updateResponse.json();


   if(updateResponse.ok){

alert("Rating updated ⭐");

userRating = stars;

highlightStars(userRating);

showAverageRating();

return;

}


    return;

}

        if(response.ok){

    alert("Thanks for rating ⭐");

    userRating = stars;

    highlightStars(userRating);

    showAverageRating();

}
        else{


            alert(data.message);


        }



    }
    catch(error){

        console.log(error);

    }


}

function highlightStars(number){


    let stars =
    document.querySelectorAll("#starContainer span");


    stars.forEach((star,index)=>{


        if(index < number){

            star.innerHTML = "⭐";

        }
        else{

            star.innerHTML = "☆";

        }


    });

}




async function showAverageRating(){


    try{


        let response = await fetch(

            "https://recipe-finder-gdak.onrender.com/api/ratings/" + recipe._id

        );


        let data = await response.json();



        document.getElementById("averageRating").innerHTML =
        data.average;

        showAverageStars(Number(data.average));

        document.getElementById("ratingCount").innerHTML =
        data.count;



    }
    catch(error){

        console.log(error);

    }


}

async function restoreUserRating(){

    if(!recipe || !recipe._id){
        console.log("Recipe not loaded yet");
        return;
    }


    let response = await fetch(
        "https://recipe-finder-gdak.onrender.com/api/ratings/" + recipe._id
    );

    let data = await response.json();

    let myRating = data.ratings.find(r =>
        r.userId._id === currentUser.id
    );

    if(myRating){

    console.log("My rating is:", myRating.rating);

    userRating = myRating.rating;

    highlightStars(userRating);

}

}
function showAverageStars(number){

    let stars = "";

    let rating = Math.round(number);


    for(let i = 1; i <= 5; i++){

        if(i <= rating){

            stars += "⭐";

        }
        else{

            stars += "☆";

        }

    }


    document.getElementById("averageStars").innerHTML = stars;

}

function previewStars(number){

    highlightStars(number);

    document.getElementById("ratingPreview").innerHTML =
    "You are rating: " + number + " stars ⭐";

}
// ===============================
// Favorite Recipe System
// ===============================






async function toggleFavorite(){

    let button =
    document.getElementById("saveRecipeBtn");


    if(!isSaved){


        let response = await fetch(
            "https://recipe-finder-gdak.onrender.com/api/favorites",
            {
                method:"POST",

                headers:{

"Content-Type":"application/json",

"Authorization":
"Bearer "+localStorage.getItem("token")

},
                body:JSON.stringify({

recipeId:recipe._id

                })
            }
        );


        let data = await response.json();


        if(response.ok){

            isSaved = true;

            button.innerHTML =
            "💚 Saved";

        }


    }

    else{


        let response = await fetch(

            "https://recipe-finder-gdak.onrender.com/api/favorites/"
            +
            currentUser.id
            +
            "/"
            +
            recipe._id,

            {
                method:"DELETE"
            }

        );


        if(response.ok){

            isSaved = false;

            button.innerHTML =
            "❤️ Save Recipe";

        }


    }

}



async function saveRecipe(){

    let button =
    document.getElementById("saveRecipeBtn");


    let saved =
    button.dataset.saved === "true";


    try{

        // REMOVE FROM FAVORITES

        if(saved){

            let response = await fetch(

"https://recipe-finder-gdak.onrender.com/api/favorites/"
+
recipe._id,

{

method:"DELETE",

headers:{

"Authorization":
"Bearer "+localStorage.getItem("token")

}

}

);

            let data = await response.json();

            if(response.ok){

                button.innerHTML = "❤️ Save Recipe";

                button.dataset.saved = "false";
                isSaved = false;

            }
            else{

                alert(data.error);

            }

        }

        // SAVE TO FAVORITES

        else{

            let response = await fetch(

                "https://recipe-finder-gdak.onrender.com/api/favorites",

                {

                    method:"POST",
headers:{

"Content-Type":"application/json",

"Authorization":
"Bearer "+localStorage.getItem("token")

},

                    body:JSON.stringify({

recipeId:recipe._id

                    })

                }

            );

            let data = await response.json();

            if(response.ok){

                button.innerHTML = "❤️ Saved";

                button.dataset.saved = "true";

            }
            else{

                alert(data.message);

            }

        }

    }

    catch(error){

        console.log(error);

    }

}




async function checkFavoriteStatus(){

    if(!recipe || !recipe._id){
        console.log("Recipe not loaded yet");
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


        let favorites = await response.json();


        let found = favorites.find(favorite =>
            String(favorite.recipeId) === String(recipe._id)
        );


        if(found){

            isSaved = true;

            let button =
            document.getElementById("saveRecipeBtn");


            button.innerHTML =
            "💚 Saved";


            button.dataset.saved = "true";

        }


    }
    catch(error){

        console.log(error);

    }

}

function shareRecipe(){


    let recipeName =
    document.getElementById("recipeName").innerText;


    let recipeUrl =
    window.location.href;



    if(navigator.share){


        navigator.share({

            title: recipeName,

            text:
            "Check out this delicious recipe 🍽",

            url: recipeUrl

        })

        .then(()=>{

            console.log("Recipe shared");

        })

        .catch(error=>{

            console.log(error);

        });


    }

    else{


        navigator.clipboard.writeText(recipeUrl);


        alert(
        "Recipe link copied 🔗"
        );


    }


}
function printRecipe(){

    window.print();

}



function startCooking(){

    let savedProgress =
    JSON.parse(localStorage.getItem("cookingProgress"));


    if(savedProgress && savedProgress.recipeId === recipe._id){

        document.getElementById("resumeText").innerHTML =
        `
        🍽 ${recipe.name}<br><br>
        You stopped at:<br>
        Step ${savedProgress.step + 1} / ${recipe.steps.length}
        `;


        document.getElementById("resumePopup").style.display="flex";

        return;

    }


    currentStepIndex = 0;
    timerSeconds = recipe.steps[currentStepIndex].time;

    document.getElementById("cookingMode").style.display="block";

    showStep();

    document.getElementById("cookingMode")
    .scrollIntoView({
        behavior:"smooth"
    });

}
function showStep(){

    let step =
    recipe.steps[currentStepIndex];
timerSeconds = step.time;

updateTimerDisplay();

    document.getElementById("stepCounter").innerHTML =

    "Step " +
    (currentStepIndex + 1) +
    " / " +
    recipe.steps.length;



    document.getElementById("currentStep").innerHTML = `


<h3>
${step.title}
</h3>


<img 
src="${step.image}" 
class="cooking-step-image"
onerror="this.style.display='none'"
>


<p>
${step.description}
</p>

<span>
⏱ Cooking Time:
${Math.floor(step.time/60)}
:
${step.time % 60 === 0 ? "00" : step.time % 60}
</span>


    `;



    let progress =
    ((currentStepIndex + 1) /
    recipe.steps.length) * 100;


    document.getElementById("progressBar").style.width =
    progress + "%";


    document.getElementById("progressText").innerHTML =
    Math.round(progress) + "%";



    let previousBtn =
    document.getElementById("previousBtn");


    let nextBtn =
    document.getElementById("nextBtn");



    if(currentStepIndex === 0){

        previousBtn.disabled = true;

    }
    else{

        previousBtn.disabled = false;

    }



    if(currentStepIndex === recipe.steps.length-1){

        nextBtn.innerHTML =
        "Finish Recipe 🎉";

    }

    else{

        nextBtn.innerHTML =
        "Next ➡";

    }


    saveCookingProgress();

}
function nextStep(){

   if(currentStepIndex < recipe.steps.length - 1){

        clearInterval(timerInterval);

        timerInterval = null;

        timerRunning = false;


        currentStepIndex++;


        timerSeconds =
        recipe.steps[currentStepIndex].time;


        updateTimerDisplay();


        showStep();

    }

    else{

        alert(
        "🎉 Congratulations!\n\nYou completed this recipe."
        );

        localStorage.removeItem(
        "cookingProgress"
        );

        exitCookingMode();

    }

}

function previousStep(){

    if(currentStepIndex > 0){

        currentStepIndex--;

        showStep();

    }

}
function exitCookingMode(){

    document.getElementById("cookingMode").style.display = "none";

}

function toggleTimer(){
    console.log("Timer seconds:", timerSeconds);

    let button =
    document.getElementById("timerButton");


    if(timerRunning){

        clearInterval(timerInterval);

        timerInterval = null;

        timerRunning = false;

        button.innerHTML =
        "▶ Resume Timer";

    }

    else{

        timerRunning = true;


        button.innerHTML =
        "⏸ Pause Timer";


        timerInterval = setInterval(()=>{


            if(timerSeconds > 0){

                timerSeconds--;

                updateTimerDisplay();

            }

            else{

                clearInterval(timerInterval);

                timerInterval = null;

                timerRunning = false;


                button.innerHTML =
                "▶ Start Timer";


                


let sound = document.getElementById("timerSound");

sound.currentTime = 0;

sound.play();


setTimeout(()=>{

    document.getElementById("timerPopup").style.display="flex";

},500);
            }


        },1000);

    }

}

function resetTimer(){

    clearInterval(timerInterval);

    timerInterval = null;

    timerRunning = false;


    document.getElementById("timerButton").innerHTML =
    "▶ Start Timer";


    timerSeconds =
    recipe.steps[currentStepIndex].time;


    updateTimerDisplay();

}

function updateTimerDisplay(){

    let minutes = Math.floor(timerSeconds / 60);
    let seconds = timerSeconds % 60;

    document.getElementById("timer").innerHTML =
        String(minutes).padStart(2,"0")
        + ":"
        + String(seconds).padStart(2,"0");

}
function closeTimerPopup(){

    document.getElementById("timerPopup").style.display="none";

}

function nextStepFromPopup(){

    closeTimerPopup();

    if(currentStepIndex < recipe.steps.length - 1){

        currentStepIndex++;

        showStep();

    }

    else{

        alert("🎉 Recipe completed!");

    }

}

function saveCookingProgress(){

    let progress = {

        recipeId: recipe._id,

        step: currentStepIndex,

        recipeName: recipe.name

    };


    localStorage.setItem(
        "cookingProgress",
        JSON.stringify(progress)
    );

}

function resumeCooking(){

    let savedProgress =
    JSON.parse(localStorage.getItem("cookingProgress"));


    currentStepIndex = savedProgress.step;


    document.getElementById("resumePopup").style.display="none";


    document.getElementById("cookingMode").style.display="block";


    showStep();


    document.getElementById("cookingMode")
    .scrollIntoView({
        behavior:"smooth"
    });

}



function startFreshCooking(){

    localStorage.removeItem("cookingProgress");


    currentStepIndex = 0;


    document.getElementById("resumePopup").style.display="none";


    document.getElementById("cookingMode").style.display="block";


    showStep();


    document.getElementById("cookingMode")
    .scrollIntoView({
        behavior:"smooth"
    });

}
async function pinComment(id){

    let response = await fetch(
        "https://recipe-finder-gdak.onrender.com/api/comments/pin/" + id,
        {
            method:"PUT",

            headers:{
                "Content-Type":"application/json",
                "Authorization":
                "Bearer " + localStorage.getItem("token")
            },

            body:JSON.stringify({

                userId: currentUser.id

            })

        }
    );


    let data = await response.json();
    console.log("PIN RESPONSE:", data);

    


    if(response.ok){

    if(data.pinned){

        alert("Comment pinned 📌");

    }
    else{

        alert("Comment unpinned");

    }


    displayComments();

}
    else{

        alert(data.error);

    }

}

loadRecipe();

