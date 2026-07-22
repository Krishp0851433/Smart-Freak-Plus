const prisma = require("../config/prisma");


// --------------------------------
// Workout Templates
// --------------------------------

const workoutTemplates = {

    GAIN_WEIGHT: [
        { day_name: "MONDAY", focus_area: "CHEST" },
        { day_name: "TUESDAY", focus_area: "BACK" },
        { day_name: "WEDNESDAY", focus_area: "LEGS" },
        { day_name: "THURSDAY", focus_area: "SHOULDERS" },
        { day_name: "FRIDAY", focus_area: "ARMS" },
        { day_name: "SATURDAY", focus_area: "FULL_BODY" },
        { day_name: "SUNDAY", focus_area: "REST" }
    ],


    LOSE_WEIGHT: [
        { day_name: "MONDAY", focus_area: "FULL_BODY" },
        { day_name: "TUESDAY", focus_area: "CARDIO" },
        { day_name: "WEDNESDAY", focus_area: "CHEST" },
        { day_name: "THURSDAY", focus_area: "CARDIO" },
        { day_name: "FRIDAY", focus_area: "LEGS" },
        { day_name: "SATURDAY", focus_area: "HIIT" },
        { day_name: "SUNDAY", focus_area: "REST" }
    ],


    MAINTAIN_WEIGHT: [
        { day_name: "MONDAY", focus_area: "CHEST" },
        { day_name: "TUESDAY", focus_area: "BACK" },
        { day_name: "WEDNESDAY", focus_area: "LEGS" },
        { day_name: "THURSDAY", focus_area: "SHOULDERS" },
        { day_name: "FRIDAY", focus_area: "ARMS" },
        { day_name: "SATURDAY", focus_area: "CARDIO" },
        { day_name: "SUNDAY", focus_area: "REST" }
    ]

};



// --------------------------------
// Assign Exercises To Workout Days
// --------------------------------

const assignExercisesToDays = async (workoutDays) => {

    for (const day of workoutDays) {


        // Skip rest day

        if (day.focus_area === "REST") {
            continue;
        }


        const exercises =
            await prisma.exercises.findMany({

                where: {

                    muscle_group:
                        day.focus_area

                },

                take: 5

            });



        if (!exercises.length) {

            console.log(
                `No exercises found for ${day.focus_area}`
            );

            continue;

        }



        let order = 1;


        for (const exercise of exercises) {


            await prisma.workout_day_exercises.create({

                data: {

                    workout_day_id:
                        day.id,


                    exercise_id:
                        exercise.id,


                    sets: 4,

                    reps: 10,

                    rest_seconds: 90,

                    exercise_order:
                        order

                }

            });


            order++;

        }

    }

};



// --------------------------------
// Generate Workout Plan
// --------------------------------

const generateWorkoutPlan = async (
    userId,
    goalType
) => {


    const template =
        workoutTemplates[goalType]
        ||
        workoutTemplates.MAINTAIN_WEIGHT;



    const workoutPlan =
        await prisma.workout_plans.create({

            data: {

                user_id:
                    userId,


                plan_name:
                    `${goalType} Weekly Plan`,


                goal_type:
                    goalType,


                created_by_ai:
                    false,


                workout_days: {

                    create:
                        template

                }

            },


            include: {

                workout_days:true

            }

        });



    // Assign exercises automatically

    await assignExercisesToDays(
        workoutPlan.workout_days
    );



    return workoutPlan;

};



module.exports = {

    generateWorkoutPlan

};