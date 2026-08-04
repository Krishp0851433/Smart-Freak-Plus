const express = require("express");

const router =
    express.Router();


const waterController =
    require("../controllers/water.controller");


const authMiddleware =
    require("../middleware/auth.middleware");



// Add water

router.post(

    "/add",

    authMiddleware,

    waterController.addWater

);



// Today's water

router.get(

    "/today",

    authMiddleware,

    waterController.getTodayWater

);



module.exports = router;