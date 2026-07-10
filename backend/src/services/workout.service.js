const prisma = require("../config/prisma");


// --------------------------------
// Workout Templates
// --------------------------------

const workoutTemplates = {

    GAIN_WEIGHT: [
        {
            day_name: "MONDAY",
            focus_area: "CHEST"
        },
        {
            day_name: "TUESDAY",
            focus_area: "BACK"
        },
        {
            day_name: "WEDNESDAY",
            focus_area: "LEGS"
        },
        {
            day_name: "THURSDAY",
            focus_area: "SHOULDERS"
        },
        {
            day_name: "FRIDAY",
            focus_area: "ARMS"
        },
        {
            day_name: "SATURDAY",
            focus_area: "FULL_BODY"
        },
        {
            day_name: "SUNDAY",
            focus_area: "REST"
        }
    ],


    LOSE_WEIGHT: [
        {
            day_name: "MONDAY",
            focus_area: "FULL_BODY"
        },
        {
            day_name: "TUESDAY",
            focus_area: "CARDIO"
        },
        {
            day_name: "WEDNESDAY",
            focus_area: "CHEST"
        },
        {
            day_name: "THURSDAY",
            focus_area: "CARDIO"
        },
        {
            day_name: "FRIDAY",
            focus_area: "LEGS"
        },
        {
            day_name: "SATURDAY",
            focus_area: "HIIT"
        },
        {
            day_name: "SUNDAY",
            focus_area: "REST"
        }
    ],


    MAINTAIN_WEIGHT: [
        {
            day_name:"MONDAY",
            focus_area:"CHEST"
        },
        {
            day_name:"TUESDAY",
            focus_area:"BACK"
        },
        {
            day_name:"WEDNESDAY",
            focus_area:"LEGS"
        },
        {
            day_name:"THURSDAY",
            focus_area:"SHOULDERS"
        },
        {
            day_name:"FRIDAY",
            focus_area:"ARMS"
        },
        {
            day_name:"SATURDAY",
            focus_area:"CARDIO"
        },
        {
            day_name:"SUNDAY",
            focus_area:"REST"
        }
    ]

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

            user_id:userId,

            plan_name:
                `${goalType} Weekly Plan`,

            goal_type:
                goalType,

            created_by_ai:false,


            workout_days: {

                create:
                    template

            }

        },


        include:{

            workout_days:true

        }

    });



    return workoutPlan;

};



module.exports = {

    generateWorkoutPlan

};