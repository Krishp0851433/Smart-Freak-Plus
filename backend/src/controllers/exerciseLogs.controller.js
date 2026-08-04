const exerciseLogsService = require("../services/exerciseLogs.service");

// ======================================
// Log Completed Exercise
// POST /exercise/log
// ======================================

const logExercise = async (req, res) => {

    try {

        const userId = req.user.userId;

        const exerciseLog =
            await exerciseLogsService.logExercise(
                userId,
                req.body
            );


        return res.status(201).json({

            success: true,

            message: "Exercise logged successfully",

            data: exerciseLog

        });


    } catch (error) {


        console.error(
            "Log Exercise Error:",
            error
        );


        if (error.message === "Exercise not found") {

            return res.status(404).json({

                success: false,

                message: error.message

            });

        }


        return res.status(500).json({

            success: false,

            message: error.message

        });


    }

};



// ======================================
// Get Exercise History
// GET /exercise/history
// ======================================

const getExerciseHistory = async (req, res) => {

    try {


        const userId = req.user.userId;


        const history =
            await exerciseLogsService.getExerciseHistory(
                userId
            );


        const formattedHistory =
            history.map(log => ({


                id: log.id,


                exercise:
                    log.exercises.exercise_name,


                muscle_group:
                    log.exercises.muscle_group,


                category:
                    log.exercises.category,


                sets:
                    log.sets,


                reps:
                    log.reps,


                weight_used:
                    log.weight_used,


                duration:
                    log.duration,


                calories_burned:
                    log.calories_burned,


                completed_at:
                    log.completed_at


            }));


        return res.status(200).json({

            success: true,

            count: formattedHistory.length,

            data: formattedHistory

        });


    } catch (error) {


        console.error(
            "Get Exercise History Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: error.message

        });


    }

};



module.exports = {

    logExercise,

    getExerciseHistory

};