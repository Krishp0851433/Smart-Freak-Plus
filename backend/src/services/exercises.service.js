const prisma = require("../config/prisma");


// Get all exercises
const getAllExercises = async () => {

    const exercises =
        await prisma.exercises.findMany({

            orderBy: {
                created_at: "desc"
            }

        });


    return exercises;

};



// Get single exercise

const getExerciseById = async (id) => {


    const exercise =
        await prisma.exercises.findUnique({

            where:{
                id
            }

        });


    if(!exercise){

        throw new Error(
            "Exercise not found"
        );

    }


    return exercise;

};



// Get exercises by muscle group

const getExercisesByMuscle =
async (muscleGroup)=>{


    const exercises =
        await prisma.exercises.findMany({

            where:{

                muscle_group:{
                    equals:
                    muscleGroup,
                    mode:"insensitive"
                }

            },


            orderBy:{
                exercise_name:"asc"
            }

        });


    return exercises;

};



module.exports = {

    getAllExercises,

    getExerciseById,

    getExercisesByMuscle

};