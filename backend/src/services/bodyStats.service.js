const prisma = require("../config/prisma");


// ======================================
// Add Body Stats
// ======================================

const updateBodyStats = async (userId, data) => {


    const bodyStats =
        await prisma.body_stats.create({

            data: {

                user_id: userId,

                weight: data.weight,

                body_fat: data.body_fat,

                muscle_mass: data.muscle_mass,

                bmi: data.bmi

            }

        });


    return bodyStats;

};



// ======================================
// Get Progress History
// ======================================

const getBodyProgress = async (userId) => {


    const progress =
        await prisma.body_stats.findMany({

            where: {

                user_id: userId

            },

            orderBy: {

                recorded_at: "desc"

            }

        });


    return progress;

};



module.exports = {

    updateBodyStats,

    getBodyProgress

};
