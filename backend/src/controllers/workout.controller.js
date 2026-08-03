const workoutService = require("../services/workout.service");
const prisma = require("../config/prisma");


// --------------------------------
// Generate Workout
// --------------------------------

exports.generateWorkout = async (req,res)=>{

    try{

        const userId = req.user.userId;


        const user =
            await prisma.users.findUnique({

                where:{
                    id:userId
                }

            });



        if(!user){

            return res.status(404).json({

                success:false,
                message:"User not found"

            });

        }



        if(!user.goal_type){

            return res.status(400).json({

                success:false,
                message:"User onboarding not completed"

            });

        }



        const workout =
            await workoutService.generateWorkoutPlan(
                userId,
                user.goal_type
            );



        res.json({

            success:true,

            message:
            "Workout plan generated successfully",

            data:workout

        });



    }catch(error){

        console.log(
            "WORKOUT ERROR:",
            error
        );


        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};





// --------------------------------
// Get Workout
// --------------------------------

exports.getWorkout = async (req,res)=>{

    try{


        const userId = req.user.userId;



        const workout =
            await workoutService.getWorkoutPlan(
                userId
            );



        if(!workout){

            return res.status(404).json({

                success:false,

                message:"Workout plan not found"

            });

        }



        res.json({

            success:true,

            message:
            "Workout fetched successfully",

            data:workout

        });



    }catch(error){


        console.log(
            "GET WORKOUT ERROR:",
            error
        );



        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};