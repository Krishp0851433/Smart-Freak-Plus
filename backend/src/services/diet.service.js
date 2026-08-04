const prisma = require("../config/prisma");


// ======================================
// Generate Diet Plan
// ======================================

const generateDietPlan = async (
    userId
) => {

    const user =
        await prisma.users.findUnique({

            where: {
                id: userId
            }

        });


    if (!user) {

        throw new Error(
            "User not found"
        );

    }


    // Default calories
    let calories = 2000;


    // Calculate calories based on user data
    if (
        user.weight &&
        user.height
    ) {

        const weight =
            Number(user.weight);

        const height =
            Number(user.height);


        const bmr =
            (10 * weight) +
            (6.25 * height) -
            5;


        calories =
            Math.round(
                bmr * 1.4
            );

    }


    // Macronutrients

    const protein =
        Math.round(
            user.weight
                ? Number(user.weight) * 2
                : 150
        );


    const fat =
        Math.round(
            calories * 0.25 / 9
        );


    const carbs =
        Math.round(
            (calories - 
            (protein * 4) -
            (fat * 9)) / 4
        );



    const dietPlan =
        await prisma.diet_plans.create({

            data: {

                user_id: userId,

                plan_name:
                    "AI Generated Diet Plan",

                daily_calories:
                    calories,

                protein_target:
                    protein,

                carb_target:
                    carbs,

                fat_target:
                    fat,

                created_by_ai:
                    true

            }

        });



    return {

        dietPlan,

        mealSuggestions: [

            {
                meal:"Breakfast",
                foods:[
                    "Oats",
                    "Eggs",
                    "Fruits"
                ]
            },

            {
                meal:"Lunch",
                foods:[
                    "Chicken/Rice",
                    "Vegetables"
                ]
            },

            {
                meal:"Dinner",
                foods:[
                    "Fish",
                    "Salad",
                    "Protein Source"
                ]
            }

        ]

    };

};




// ======================================
// Get Diet Plans
// ======================================


const getDietPlans = async (
    userId
)=>{


    const plans =
        await prisma.diet_plans.findMany({

            where:{
                user_id:userId
            },


            orderBy:{
                created_at:"desc"
            }

        });


    return plans;

};



module.exports = {

    generateDietPlan,

    getDietPlans

};