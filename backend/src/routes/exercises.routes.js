const express = require("express");

const router = express.Router();


const exercisesController =
    require("../controllers/exercises.controller");


// Get all exercises

router.get(
    "/",
    exercisesController.getAllExercises
);


// Get exercises by muscle group

router.get(
    "/muscle/:muscle",
    exercisesController.getExercisesByMuscle
);


// Get single exercise

router.get(
    "/:id",
    exercisesController.getExerciseById
);



module.exports = router;