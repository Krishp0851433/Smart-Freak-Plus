const prisma = require("../config/prisma");


// ==============================
// Log Completed Exercise
// ==============================

const logExercise = async (
    userId,
    exerciseData
) => {


    const {
        exercise_id,
        sets,
        reps,
        weight_used,
        duration
    } = exerciseData;



    // Check exercise exists

    const exercise =
        await prisma.exercises.findUnique({

            where:{
                id: exercise_id
            }

        });



    if(!exercise){

        throw new Error(
            "Exercise not found"
        );

    }



    let caloriesBurned = null;



    if(
        duration &&
        exercise.calories_per_min
    ){

        caloriesBurned =
            Number(exercise.calories_per_min) *
            Number(duration);

    }



    const exerciseLog =
        await prisma.exercise_logs.create({

            data:{

                user_id: userId,

                exercise_id: exercise_id,

                sets,

                reps,

                weight_used,

                duration,

                calories_burned: caloriesBurned

            }

        });



    return exerciseLog;


};




// ==============================
// Get User Exercise History
// ==============================


const getExerciseHistory =
async(userId)=>{


    const history =
        await prisma.exercise_logs.findMany({

            where:{
                user_id:userId
            },


            include:{

                exercises:{

                    select:{

                        exercise_name:true,

                        muscle_group:true,

                        category:true

                    }

                }

            },


            orderBy:{

                completed_at:"desc"

            }


        });



    return history;


};



module.exports = {

    logExercise,

    getExerciseHistory

};