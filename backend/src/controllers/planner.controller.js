const plannerService = require("../services/planner.service");

const getTodayWorkout = async (req, res) => {
  try {
    const result = await plannerService.getTodayWorkout(
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      message: "Today's workout fetched successfully.",
      data: result,
    });

  } catch (error) {

    console.error("Planner Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  getTodayWorkout,
};