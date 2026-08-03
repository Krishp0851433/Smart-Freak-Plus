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
// Assign Exercises
// --------------------------------

const assignExercisesToDays = async (workoutDays) => {

    for (const day of workoutDays) {


        if (day.focus_area === "REST") {
            continue;
        }



        const exercises =
            await prisma.exercises.findMany({

                where: {
                    muscle_group: day.focus_area
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

                    exercise_order: order

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

    try {


        // Check existing plan

        const existingPlan =
            await prisma.workout_plans.findFirst({

                where: {
                    user_id:userId
                },

                include:{
                    workout_days:{
                        include:{
                            workout_day_exercises:{
                                include:{
                                    exercise:true
                                }
                            }
                        }
                    }
                }

            });



            if(existingPlan){

                const days =
                    await prisma.workout_days.findMany({
            
                        where:{
                            workout_plan_id: existingPlan.id
                        }
            
                    });
            
            
                for(const day of days){
            
                    const count =
                        await prisma.workout_day_exercises.count({
            
                            where:{
                                workout_day_id: day.id
                            }
            
                        });
            
            
                    if(count === 0){
            
                        await assignExercisesToDays([day]);
            
                    }
            
                }
            
            
                return await prisma.workout_plans.findUnique({
            
                    where:{
                        id: existingPlan.id
                    },
            
                    include:{
            
                        workout_days:{
            
                            include:{
            
                                workout_day_exercises:{
            
                                    include:{
                                        exercise:true
                                    }
            
                                }
            
                            }
            
                        }
            
                    }
            
                });
            
            }



        const template =
            workoutTemplates[goalType]
            ||
            workoutTemplates.MAINTAIN_WEIGHT;




        const workoutPlan =
            await prisma.workout_plans.create({

                data:{


                    user_id:userId,


                    plan_name:
                        `${goalType} Weekly Plan`,


                    goal_type:
                        goalType,


                    created_by_ai:false,


                    workout_days:{
                        create:template
                    }

                }

            });





        const workoutDays =
            await prisma.workout_days.findMany({

                where:{
                    workout_plan_id:
                        workoutPlan.id
                }

            });





        await assignExercisesToDays(
            workoutDays
        );





        const finalPlan =
            await prisma.workout_plans.findUnique({

                where:{
                    id:workoutPlan.id
                },


                include:{

                    workout_days:{

                        include:{

                            workout_day_exercises:{

                                include:{
                                    exercise:true
                                }

                            }

                        }

                    }

                }

            });



        return finalPlan;



    } catch(error){

        console.log(
            "Workout generation error:",
            error
        );

        throw error;

    }

};
// --------------------------------
// Get User Workout Plan
// --------------------------------

const getWorkoutPlan = async (userId) => {


    const workoutPlan =
        await prisma.workout_plans.findFirst({

            where:{
                user_id:userId
            },


            include:{

                workout_days:{

                    orderBy:{
                        day_name:"asc"
                    },


                    include:{

                        workout_day_exercises:{

                            orderBy:{
                                exercise_order:"asc"
                            },


                            include:{

                                exercise:true

                            }

                        }

                    }

                }

            }

        });



    return workoutPlan;

};





module.exports = {

    generateWorkoutPlan,
    getWorkoutPlan

};