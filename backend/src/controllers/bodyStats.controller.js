const bodyStatsService =
    require("../services/bodyStats.service");



// ======================================
// POST /body/update
// ======================================

const updateBodyStats = async (req, res) => {


    try {


        const userId = req.user.userId;


        const bodyStats =
            await bodyStatsService.updateBodyStats(

                userId,

                req.body

            );


        return res.status(201).json({

            success: true,

            message: "Body stats updated successfully",

            data: bodyStats

        });



    } catch (error) {


        console.error(
            "Update Body Stats Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: error.message

        });


    }


};





// ======================================
// GET /body/progress
// ======================================

const getBodyProgress = async (req, res) => {


    try {


        const userId = req.user.userId;


        const progress =
            await bodyStatsService.getBodyProgress(

                userId

            );



        return res.status(200).json({

            success: true,

            count: progress.length,

            data: progress

        });



    } catch (error) {


        console.error(
            "Get Body Progress Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: error.message

        });


    }


};



module.exports = {

    updateBodyStats,

    getBodyProgress

};

