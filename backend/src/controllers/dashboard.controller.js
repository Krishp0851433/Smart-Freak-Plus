const dashboardService = require("../services/dashboard.service");

const getDashboard = async (req, res) => {
  try {
    const dashboard =
      await dashboardService.getDashboard(
        req.user.userId
      );

    return res.status(200).json({
      success: true,
      message: "Dashboard fetched successfully.",
      data: dashboard,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getDashboard,
};