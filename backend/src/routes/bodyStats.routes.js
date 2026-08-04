const express = require("express");

const router = express.Router();

const {

    updateBodyStats,

    getBodyProgress

} =
require("../controllers/bodyStats.controller");


const authMiddleware =
require("../middleware/auth.middleware");



// POST /body/update

router.post(

    "/update",

    authMiddleware,

    updateBodyStats

);



// GET /body/progress

router.get(

    "/progress",

    authMiddleware,

    getBodyProgress

);



module.exports = router;