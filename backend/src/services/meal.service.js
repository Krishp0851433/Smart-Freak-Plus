const prisma = require("../config/prisma");


// ======================================
// Log Meal
// ======================================

const logMeal = async (
    userId,
    mealData
) => {

    const {
        meal_name,
        calories,
        protein,
        carbs,
        fats
    } = mealData;


    const mealLog =
        await prisma.meal_logs.create({

            data: {

                user_id: userId,

                meal_name,

                calories,

                protein,

                carbs,

                fats

            }

        });


    return mealLog;

};



// ======================================
// Get Meal History
// ======================================

const getMealHistory = async (
    userId
) => {


    const history =
        await prisma.meal_logs.findMany({

            where: {

                user_id: userId

            },


            orderBy: {

                meal_time: "desc"

            }

        });


    return history;

};



module.exports = {

    logMeal,

    getMealHistory

};