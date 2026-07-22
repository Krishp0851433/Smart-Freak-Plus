const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const plannerController = require("../controllers/planner.controller");

router.get(
  "/today",
  authMiddleware,
  plannerController.getTodayWorkout
);

module.exports = router;