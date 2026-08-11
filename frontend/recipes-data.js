const recipes = {

    Pizza: {
        id:"6a5f65c3e01f35ac5ea425cb",
        name: "Margherita Pizza",
        ownerId:"6a6473441f3a823080fdf58b",
        category: "Italian",

        rating: 4.8,

        reviews: 245,

        time: "30 mins",

        difficulty: "Easy",

        servings: 4,

        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",

        ingredients: [
            "2 cups all-purpose flour",
            "1 tsp yeast",
            "1 tsp sugar",
            "1 tsp salt",
            "1 tbsp olive oil",
            "1 cup mozzarella cheese",
            "1/2 cup pizza sauce",
            "1 onion (chopped)",
            "1 capsicum (chopped)"
        ],

        steps: [

            {
                title: "Step 1 - Prepare the Dough",

                image: "https://images.unsplash.com/photo-1509440159596-0249088772ff",

                description: "In a large bowl, mix flour, yeast, sugar, and salt. Add warm water and olive oil. Knead for about 10 minutes until the dough becomes smooth and elastic. Cover it with a cloth and let it rest for 1 hour.",
                time:300            
            },


            {
                title: "Step 2 - Prepare the Toppings",

                image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",

                description: "Wash and chop the vegetables into thin slices. Grate the mozzarella cheese and keep the pizza sauce ready.",
                 time:180
            },

            {
                title: "Step 3 - Shape the Pizza",

                image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",

                description: "Roll the dough into a circular shape about 10 to 12 inches wide. Make sure the base has an even thickness.",
                time:120
            },

            {
                title: "Step 4 - Add Sauce and Toppings",

                image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65",

                description: "Spread the pizza sauce evenly over the base. Sprinkle cheese generously and arrange the vegetables on top.",
                time:180
            },

            {
                title: "Step 5 - Bake",

                image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",

                description: "Bake in a preheated oven at 200°C for 15–20 minutes until the cheese melts and the crust turns golden brown.",
                time:900
            }

        ],

        nutrition: {

            calories: "285 kcal",

            protein: "12 g",

            carbs: "36 g",

            fat: "10 g"

        },

        chefTips: [

            "Always preheat the oven before baking.",

            "Use fresh mozzarella for better taste.",

            "Avoid adding too many toppings."

        ]

    },


    Pasta: {
        id:"6a5f66e5e01f35ac5ea425cc",
        name: "Creamy Garlic Pasta",

        category: "Italian",

        rating: 4.7,

        reviews: 180,

        time: "25 mins",

        difficulty: "Easy",

        servings: 3,

        image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601",

        ingredients: [
            "200g pasta",
            "2 tbsp butter",
            "4 garlic cloves",
            "1 cup cream",
            "1 cup cheese",
            "Mixed herbs",
            "Salt according to taste"
        ],

        steps: [

            {
                title:"Step 1 - Boil Pasta",

                image:"https://images.unsplash.com/photo-1551183053-bf91a1d81141",

                description:"Boil pasta in salted water until soft.",
                time:600
            },

            {
                title:"Step 2 - Prepare Sauce",

                image:"https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9",

                description:"Cook garlic with butter, add cream and cheese to make sauce.",
                time:300
            },

            {
                title:"Step 3 - Mix and Serve",

                image:"https://images.unsplash.com/photo-1473093295043-cdd812d0e601",

                description:"Mix pasta with sauce and serve hot.",
                time:180
            }

        ],

        nutrition: {

            calories:"320 kcal",
            protein:"14 g",
            carbs:"45 g",
            fat:"12 g"

        },

        chefTips:[

            "Do not overcook pasta.",
            "Use fresh herbs.",
            "Add cheese while sauce is warm."

        ]

    },


    Burger: {
        id:"6a5f6704e01f35ac5ea425cd",
        name: "Classic Cheese Burger",

        category: "Fast Food",

        rating: 4.6,

        reviews: 210,

        time: "20 mins",

        difficulty: "Easy",

        servings: 2,

        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",


        ingredients:[

            "2 burger buns",
            "2 vegetable patties",
            "2 cheese slices",
            "1 tomato (sliced)",
            "1 onion (sliced)",
            "Lettuce leaves",
            "Mayonnaise",
            "Ketchup"

        ],


        steps:[

            {
                title:"Step 1 - Prepare the Patty",

                image:"https://images.unsplash.com/photo-1550547660-d9450f859349",

                description:"Prepare the vegetable patty and cook it on a pan until it becomes crispy and golden.",
                time:300
            },


            {
                title:"Step 2 - Prepare the Bun",

                image:"https://images.unsplash.com/photo-1565299507177-b0ac66763828",

                description:"Cut the burger buns into two halves and lightly toast them.",
                time:120
            },


            {
                title:"Step 3 - Assemble the Burger",

                image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd",

                description:"Apply sauces on the bun. Add lettuce, patty, cheese, tomato and onion. Cover with the top bun.",
                time:180
            }

        ],


        nutrition:{

            calories:"350 kcal",

            protein:"15 g",

            carbs:"40 g",

            fat:"14 g"

        },


        chefTips:[

            "Toast the buns for better texture.",

            "Use fresh vegetables.",

            "Serve immediately for best taste."

        ]

    },


    Biryani: {
         id:"6a5f6727e01f35ac5ea425ce",
        name: "Chicken Biryani",

        category: "Indian",

        rating: 4.9,

        reviews: 350,

        time: "60 mins",

        difficulty: "Medium",

        servings: 4,

        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0",


        ingredients:[

            "2 cups basmati rice",
            "500g chicken",
            "2 onions (sliced)",
            "1 cup curd",
            "Biryani spices",
            "Ginger garlic paste",
            "Mint leaves",
            "Coriander leaves",
            "Salt according to taste"

        ],


        steps:[

            {
                title:"Step 1 - Prepare Chicken Marinade",

                image:"https://images.unsplash.com/photo-1603894584373-5ac82b2ae398",

                description:"Mix chicken with curd, spices, ginger garlic paste and salt. Keep it aside for marination.",
                time:900
            },


            {
                title:"Step 2 - Cook Rice",

                image:"https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6",

                description:"Wash basmati rice and cook it until it is partially done.",
                time:600
            },


            {
                title:"Step 3 - Layer the Biryani",

                image:"https://images.unsplash.com/photo-1563379926898-05f4575a45d8",

                description:"Make layers of rice and cooked chicken. Add mint and coriander leaves between layers.",
                time:300
            },


            {
                title:"Step 4 - Final Cooking",

                image:"https://images.unsplash.com/photo-1589302168068-964664d93dc0",

                description:"Cover the pot and cook on low flame until the flavours combine properly.",
                time:1200
            }

        ],


        nutrition:{

            calories:"450 kcal",

            protein:"25 g",

            carbs:"55 g",

            fat:"15 g"

        },


        chefTips:[

            "Use good quality basmati rice.",

            "Allow the biryani to rest before serving.",

            "Fresh spices improve the flavour."

        ]

    }

};