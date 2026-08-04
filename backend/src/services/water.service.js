const prisma = require("../config/prisma");


// ======================================
// Add Water Intake
// ======================================

const addWater = async (
    userId,
    amount_ml
) => {


    const waterLog =
        await prisma.water_tracking.create({

            data: {

                user_id: userId,

                amount_ml

            }

        });


    return waterLog;

};




// ======================================
// Get Today's Water
// ======================================

const getTodayWater = async (
    userId
) => {


    const startOfDay =
        new Date();

    startOfDay.setHours(
        0,
        0,
        0,
        0
    );


    const endOfDay =
        new Date();

    endOfDay.setHours(
        23,
        59,
        59,
        999
    );



    const logs =
        await prisma.water_tracking.findMany({

            where: {

                user_id: userId,

                logged_at: {

                    gte: startOfDay,

                    lte: endOfDay

                }

            },


            orderBy: {

                logged_at: "desc"

            }

        });



    const total_ml =
        logs.reduce(
            (sum, item) =>
                sum + item.amount_ml,
            0
        );



    return {

        total_ml,

        logs

    };


};



module.exports = {

    addWater,

    getTodayWater

};