async function askKitchenAI() {

    let input = document.getElementById("kitchenInput").value.trim();
    let resultBox = document.getElementById("kitchenResult");

    if (input === "") {
        resultBox.innerHTML = "<p>Please enter some ingredients.</p>";
        return;
    }

    resultBox.innerHTML = "<p>🤖 Kitchen AI is thinking...</p>";

    try {

        let response = await fetch(
            "https://recipe-finder-gdak.onrender.com/api/kitchen-ai",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ingredients: input
                })
            }
        );

        let data = await response.json();

        console.log("KITCHEN AI:", data);

        if (!response.ok) {
            resultBox.innerHTML =
                "<p>❌ Something went wrong.</p>";
            return;
        }

        if (!data.results || data.results.length === 0) {
            resultBox.innerHTML =
                "<p>😕 No matching recipes found.</p>";
            return;
        }


        // Convert user's ingredients into an array

        let userIngredients = input
            .toLowerCase()
            .split(",")
            .map(function (item) {
                return item.trim();
            })
            .filter(function (item) {
                return item !== "";
            });


        // Separate recipes

        let perfectMatches = [];
        let goodMatches = [];


        data.results.forEach(function (result) {

            let matched = result.matchedCount || 0;

            let total = userIngredients.length;

            let percentage = 0;

            if (total > 0) {
                percentage = (matched / total) * 100;
            }


            if (percentage === 100) {
                perfectMatches.push(result);
            }
            else if (percentage >= 50) {
                goodMatches.push(result);
            }

        });


        // Start result box

        resultBox.innerHTML = "";

        resultBox.innerHTML +=
            "<h2>🍽️ Recipes you can make</h2>";

        resultBox.innerHTML +=
            "<p>Based on your ingredients: <strong>" +
            input +
            "</strong></p>";


        // PERFECT MATCHES

        if (perfectMatches.length > 0) {

            resultBox.innerHTML +=
                "<h2>🥇 Perfect Matches</h2>";

            resultBox.innerHTML +=
                "<p>You have all the ingredients needed.</p>";


            perfectMatches.forEach(function (result) {
console.log("PERFECT MATCH RESULT:", result);
console.log("PERFECT MATCH RECIPE:", result.recipe);
console.log("PERFECT MATCH ID:", result.recipe?._id);
                let recipe = result.recipe;

                let matchedIngredients =
                    result.matchedUserIngredients ||
                    result.matchedIngredients ||
                    [];


                let card = document.createElement("div");

                card.className = "kitchen-recipe-card";


                card.innerHTML =

                    "<h3>🍽️ " +
                    recipe.name +
                    "</h3>" +

                    "<p>Category: " +
                    (recipe.category || "General") +
                    "</p>" +

                    "<p>Difficulty: " +
                    (recipe.difficulty || "Easy") +
                    "</p>" +

                    "<p>Time: " +
                    (recipe.time || "Unknown") +
                    "</p>" +

                    "<p>🟢 Match: " +
                    result.matchedCount +
                    "/" +
                    userIngredients.length +
                    "</p>" +

                    "<p>You have: " +
                    matchedIngredients.join(", ") +
                    "</p>";


                let button = document.createElement("button");

button.type = "button";
button.className = "view-recipe-btn";
button.textContent = "View Recipe 👀";

button.dataset.recipeId = String(recipe._id);

card.appendChild(button);
resultBox.appendChild(card);

            });

        }


        // GOOD MATCHES

        if (goodMatches.length > 0) {

            resultBox.innerHTML +=
                "<h2>🟢 Good Matches</h2>";

            resultBox.innerHTML +=
                "<p>You have some of the ingredients needed.</p>";


            goodMatches.forEach(function (result) {

                let recipe = result.recipe;

                let matchedIngredients =
                    result.matchedUserIngredients ||
                    result.matchedIngredients ||
                    [];


                let card = document.createElement("div");

                card.className = "kitchen-recipe-card";


                card.innerHTML =

                    "<h3>🍽️ " +
                    recipe.name +
                    "</h3>" +

                    "<p>Category: " +
                    (recipe.category || "General") +
                    "</p>" +

                    "<p>Difficulty: " +
                    (recipe.difficulty || "Easy") +
                    "</p>" +

                    "<p>Time: " +
                    (recipe.time || "Unknown") +
                    "</p>" +

                    "<p>🟡 Match: " +
                    result.matchedCount +
                    "/" +
                    userIngredients.length +
                    "</p>" +

                    "<p>You have: " +
                    matchedIngredients.join(", ") +
                    "</p>";


                let button = document.createElement("button");

button.type = "button";
button.className = "view-recipe-btn";
button.textContent = "View Recipe 👀";

button.dataset.recipeId = String(recipe._id);

card.appendChild(button);
resultBox.appendChild(card);

            });

        }


        // No strong matches

        if (
            perfectMatches.length === 0 &&
            goodMatches.length === 0
        ) {

            resultBox.innerHTML +=
                "<p>😕 You don't have enough matching ingredients " +
                "for a strong recipe suggestion.</p>";

        }

    }
    catch (error) {

        console.error("Kitchen AI Error:", error);

        resultBox.innerHTML =
            "<p>❌ Cannot connect to Kitchen AI.</p>";

    }

}


function openRecipe(id) {

    console.log("================================");
    console.log("OPEN RECIPE CALLED WITH ID:", id);
    console.log("ID TYPE:", typeof id);
    console.log("================================");

    if (!id) {
        console.error("❌ Recipe ID is missing");
        alert("Recipe ID is missing.");
        return;
    }

    // Clear old recipe selections
    localStorage.removeItem("selectedRecipe");
    localStorage.removeItem("selectedRecipeId");

    // Save ONLY the ID
    localStorage.setItem(
        "selectedRecipeId",
        String(id)
    );

    console.log(
        "SAVED RECIPE ID:",
        localStorage.getItem("selectedRecipeId")
    );

    window.location.href = "recipe.html";
}

document.addEventListener("click", function (event) {

    let button = event.target.closest(".view-recipe-btn");

    if (!button) {
        return;
    }

    console.log("🔥🔥 VIEW RECIPE CLICKED 🔥🔥");

    let recipeId = button.dataset.recipeId;

    console.log("Recipe ID:", recipeId);
    console.log("ID type:", typeof recipeId);

    if (!recipeId) {
        alert("Recipe ID is missing.");
        return;
    }

    openRecipe(recipeId);

});



