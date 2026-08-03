const express = require("express");

const router = express.Router();


const authMiddleware =
require("../middleware/auth.middleware");


const workoutController =
require("../controllers/workout.controller");



// Generate workout plan
router.post(

    "/generate",

    authMiddleware,

    workoutController.generateWorkout

);




// Fetch workout plan
router.get(

    "/",

    authMiddleware,

    workoutController.getWorkout

);



module.exports = router;