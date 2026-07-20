const exercisesService = require("../services/exercises.service");


// GET ALL EXERCISES

const getAllExercises = async (req, res) => {

    try {

        const exercises =
            await exercisesService.getAllExercises();


        return res.status(200).json({

            success:true,

            count: exercises.length,

            data: exercises

        });


    } catch(error){

        console.error(
            "Get Exercises Error:",
            error
        );


        return res.status(500).json({

            success:false,

            message:error.message

        });

    }

};




// GET EXERCISE BY ID

const getExerciseById = async (req,res)=>{


    try {


        const exercise =
            await exercisesService.getExerciseById(
                req.params.id
            );


        return res.status(200).json({

            success:true,

            data:exercise

        });



    } catch(error){


        console.error(
            "Get Exercise By ID Error:",
            error
        );


        return res.status(404).json({

            success:false,

            message:error.message

        });


    }


};




// GET EXERCISES BY MUSCLE GROUP

const getExercisesByMuscle =
async(req,res)=>{


    try {


        const exercises =
            await exercisesService.getExercisesByMuscle(
                req.params.muscle
            );



        return res.status(200).json({

            success:true,

            count: exercises.length,

            data: exercises

        });



    } catch(error){


        console.error(
            "Get Muscle Exercises Error:",
            error
        );


        return res.status(500).json({

            success:false,

            message:error.message

        });


    }


};



module.exports = {

    getAllExercises,

    getExerciseById,

    getExercisesByMuscle

};