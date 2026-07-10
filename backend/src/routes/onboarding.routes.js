const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const onboardingController = require("../controllers/onboarding.controller");

router.post(
  "/complete",
  authMiddleware,
  onboardingController.completeOnboarding
);

module.exports = router;