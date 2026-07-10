const Joi = require("joi");

const onboardingSchema = Joi.object({
  gender: Joi.string()
    .valid("male", "female", "other")
    .required(),

  date_of_birth: Joi.date()
    .required(),

  height: Joi.number()
    .min(50)
    .max(300)
    .required(),

  weight: Joi.number()
    .min(20)
    .max(500)
    .required(),

  goal_type: Joi.string()
    .valid(
      "LOSE_WEIGHT",
      "GAIN_WEIGHT",
      "MAINTAIN_WEIGHT",
      "BODY_RECOMPOSITION"
    )
    .required(),

  activity_level: Joi.string()
    .valid(
      "SEDENTARY",
      "LIGHT",
      "MODERATE",
      "ACTIVE",
      "VERY_ACTIVE"
    )
    .required()
});

module.exports = onboardingSchema;