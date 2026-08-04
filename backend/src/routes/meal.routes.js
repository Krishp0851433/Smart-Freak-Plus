const express = require("express");

const router = express.Router();


const mealController =
    require("../controllers/meal.controller");


const authMiddleware =
    require("../middleware/auth.middleware");



// POST meal log

router.post(

    "/log",

    authMiddleware,

    mealController.logMeal

);



// GET meal history

router.get(

    "/history",

    authMiddleware,

    mealController.getMealHistory

);



module.exports = router;