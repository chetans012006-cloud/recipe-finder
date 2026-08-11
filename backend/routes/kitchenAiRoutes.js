const express = require("express");
const router = express.Router();

const Recipe = require("../models/Recipe");








router.post("/", async (req, res) => {

    try {

        const { ingredients } = req.body;

        // Check input
        if (!ingredients) {

            return res.status(400).json({
                message: "Please enter some ingredients"
            });

        }


        // Convert user input into an array
        const userIngredients = ingredients
            .toLowerCase()
            .split(",")
            .map(item => item.trim())
            .filter(item => item !== "");


        // Get all recipes
        const recipes = await Recipe.find();


        // Store recipe names to avoid duplicates
        const seenRecipes = new Set();


        const matchingRecipes = recipes

            .map(recipe => {

                // Avoid duplicate recipes
                const recipeKey =
                    recipe.name.trim().toLowerCase();


                if (seenRecipes.has(recipeKey)) {
                    return null;
                }


                seenRecipes.add(recipeKey);


                // Find which USER ingredients
                // are available in this recipe
                const matchedUserIngredients =
                    userIngredients.filter(
                        userIngredient => {

                            return recipe.ingredients.some(
                                recipeIngredient => {

                                    const ingredientText =
                                        recipeIngredient
                                            .toLowerCase()
                                            .trim();


                                    return (
                                        ingredientText.includes(
                                            userIngredient
                                        )
                                        ||
                                        userIngredient.includes(
                                            ingredientText
                                        )
                                    );

                                }
                            );

                        }
                    );


                // Find the actual recipe ingredients
                // that matched
                const matchedIngredients =
                    recipe.ingredients.filter(
                        recipeIngredient => {

                            const ingredientText =
                                recipeIngredient
                                    .toLowerCase()
                                    .trim();


                            return userIngredients.some(
                                userIngredient => {

                                    return (
                                        ingredientText.includes(
                                            userIngredient
                                        )
                                        ||
                                        userIngredient.includes(
                                            ingredientText
                                        )
                                    );

                                }
                            );

                        }
                    );


                return {

                    recipe: recipe,

                    // How many ingredients
                    // from the user's list matched
                    matchedCount:
                        matchedUserIngredients.length,

                    // Total ingredients user entered
                    totalUserIngredients:
                        userIngredients.length,

                    // Example:
                    // ["chicken", "rice"]
                    matchedUserIngredients:
                        matchedUserIngredients,

                    // Example:
                    // ["Chicken", "Basmati rice"]
                    matchedIngredients:
                        matchedIngredients

                };

            })


            // Remove null values
            .filter(item => item !== null)


            // Only show recipes where at least
            // one user's ingredient matches
            .filter(
                item =>
                    item.matchedCount > 0
            )


            // Best matches first
            .sort(
                (a, b) => {

                    // First compare match count
                    if (
                        b.matchedCount !==
                        a.matchedCount
                    ) {

                        return (
                            b.matchedCount -
                            a.matchedCount
                        );

                    }


                    // If match count is same,
                    // prefer recipes with fewer
                    // total ingredients
                    return (
                        a.recipe.ingredients.length -
                        b.recipe.ingredients.length
                    );

                }
            );


        res.json({

            message:
                "Kitchen AI results",

            results:
                matchingRecipes

        });


    }

    catch (error) {

        console.log(
            "Kitchen AI Error:",
            error
        );


        res.status(500).json({

            message:
                "Kitchen AI failed",

            error:
                error.message

        });

    }

});


module.exports = router;