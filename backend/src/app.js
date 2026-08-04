const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const prisma = require("./config/prisma");
const authRoutes = require("./routes/auth.routes");
const onboardingRoutes = require("./routes/onboarding.routes");
const app = express(); // MUST BE FIRST
const dashboardRoutes = require("./routes/dashboard.routes");
const exercisesRoutes = require("./routes/exercises.routes");
const plannerRoutes = require("./routes/planner.routes");
const workoutRoutes = require("./routes/workout.routes");
const exerciseLogsRoutes = require("./routes/exerciseLogs.routes");
const dietRoutes = require("./routes/diet.routes");
const mealRoutes = require("./routes/meal.routes");
// =========================
// MIDDLEWARE
// =========================
app.use(cors({
  origin: true,
  credentials: true, // REQUIRED for cookies
}));

app.use(helmet());
app.use(express.json());
app.use(cookieParser()); // FIXED POSITION

// =========================
// ROUTES
// =========================
app.use("/auth", authRoutes);
app.use("/onboarding", onboardingRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/exercises", exercisesRoutes);
app.use("/planner", plannerRoutes);
app.use("/workout",workoutRoutes);
app.use("/exercise", exerciseLogsRoutes);
app.use("/diet", dietRoutes);
app.use("/meal",mealRoutes);
// =========================
// TEST ROUTE
// =========================
app.get("/", async (req, res) => {
  try {
    const users = await prisma.users.findMany();

    res.json({
      success: true,
      usersCount: users.length,
      data: users,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =========================
// START SERVER
// =========================
app.listen(5001, () => {
  console.log("Server running on http://localhost:5001");
});