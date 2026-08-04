const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const exerciseLogsController = require("../controllers/exerciseLogs.controller");

// ======================================
// Log Completed Exercise
// POST /exercise/log
// ======================================

router.post(
    "/log",
    authMiddleware,
    exerciseLogsController.logExercise
);

// ======================================
// Get Exercise History
// GET /exercise/history
// ======================================

router.get(
    "/history",
    authMiddleware,
    exerciseLogsController.getExerciseHistory
);

module.exports = router;