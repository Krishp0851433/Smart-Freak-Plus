const mealService = require("../services/meal.service");


// ======================================
// POST /meal/log
// ======================================

const logMeal = async (req, res) => {

    try {

        const userId = req.user.userId;


        const meal =
            await mealService.logMeal(
                userId,
                req.body
            );


        return res.status(201).json({

            success: true,

            message: "Meal logged successfully",

            data: meal

        });


    } catch(error) {

        console.error(
            "Log Meal Error:",
            error
        );


        return res.status(500).json({

            success:false,

            message:error.message

        });

    }

};



// ======================================
// GET /meal/history
// ======================================

const getMealHistory = async (req,res)=>{

    try {


        const userId = req.user.userId;


        const history =
            await mealService.getMealHistory(
                userId
            );


        return res.status(200).json({

            success:true,

            count:history.length,

            data:history

        });


    } catch(error) {


        console.error(
            "Get Meal History Error:",
            error
        );


        return res.status(500).json({

            success:false,

            message:error.message

        });

    }

};



module.exports = {

    logMeal,

    getMealHistory

};