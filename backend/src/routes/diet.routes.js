const express =
require("express");

const router =
express.Router();


const authMiddleware =
require("../middleware/auth.middleware");


const dietController =
require("../controllers/diet.controller");



// Generate diet plan

router.post(
    "/generate",
    authMiddleware,
    dietController.generateDiet
);



// Get diet plans

router.get(
    "/",
    authMiddleware,
    dietController.getDiet
);



module.exports =
router;