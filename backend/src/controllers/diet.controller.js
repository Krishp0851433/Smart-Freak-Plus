const dietService =
require("../services/diet.service");



// ======================================
// POST /diet/generate
// ======================================

const generateDiet =
async(req,res)=>{


    try{


        const userId =
            req.user.userId;



        const result =
            await dietService.generateDietPlan(
                userId
            );



        return res.status(201).json({

            success:true,

            message:
            "Diet plan generated successfully",

            data:result

        });



    }catch(error){


        console.error(
            "Generate Diet Error:",
            error
        );


        return res.status(500).json({

            success:false,

            message:error.message

        });


    }


};




// ======================================
// GET /diet
// ======================================


const getDiet =
async(req,res)=>{


    try{


        const userId =
            req.user.userId;



        const plans =
            await dietService.getDietPlans(
                userId
            );



        return res.json({

            success:true,

            count:
            plans.length,

            data:plans

        });



    }catch(error){


        console.error(
            "Get Diet Error:",
            error
        );


        return res.status(500).json({

            success:false,

            message:error.message

        });


    }


};



module.exports = {

    generateDiet,

    getDiet

};