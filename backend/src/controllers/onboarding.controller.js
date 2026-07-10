const onboardingSchema = require("../validations/onboarding.validation");
const onboardingService = require("../services/onboarding.service");

const completeOnboarding = async (req, res) => {
  try {
    const { error } = onboardingSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const result = await onboardingService.completeOnboarding(
      req.user.userId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Onboarding completed successfully.",
      data: result,
    });
  } catch (err) {
    console.error("Onboarding Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  completeOnboarding,
};