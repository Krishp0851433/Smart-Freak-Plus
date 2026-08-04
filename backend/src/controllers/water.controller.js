const waterService =
    require("../services/water.service");



// ======================================
// POST /water/add
// ======================================

const addWater = async (
    req,
    res
) => {


    try {


        const userId =
            req.user.userId;


        const {
            amount_ml
        } = req.body;



        if (!amount_ml) {

            return res.status(400).json({

                success:false,

                message:"amount_ml is required"

            });

        }



        const water =
            await waterService.addWater(

                userId,

                amount_ml

            );



        return res.status(201).json({

            success:true,

            message:"Water added successfully",

            data:water

        });



    } catch(error) {


        console.error(
            "Add Water Error:",
            error
        );


        return res.status(500).json({

            success:false,

            message:error.message

        });


    }


};




// ======================================
// GET /water/today
// ======================================

const getTodayWater = async (
    req,
    res
) => {


    try {


        const userId =
            req.user.userId;



        const result =
            await waterService.getTodayWater(

                userId

            );



        return res.status(200).json({

            success:true,

            data:result

        });



    } catch(error) {


        console.error(
            "Get Water Error:",
            error
        );


        return res.status(500).json({

            success:false,

            message:error.message

        });


    }


};



module.exports = {

    addWater,

    getTodayWater

};