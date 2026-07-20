const prisma = require("../config/prisma");

const getDashboard = async (userId) => {
  // Get user
  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
    include: {
      body_stats: {
        orderBy: {
          recorded_at: "desc",
        },
        take: 1,
      },
      workout_plans: {
        orderBy: {
          created_at: "desc",
        },
        take: 1,
        include: {
          workout_days: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Latest BMI
  const latestBodyStat =
    user.body_stats.length > 0
      ? user.body_stats[0]
      : null;

  // Latest Workout Plan
  const latestPlan =
    user.workout_plans.length > 0
      ? user.workout_plans[0]
      : null;

  // Today's Day Name
  const today = new Date()
    .toLocaleDateString("en-US", {
      weekday: "long",
    })
    .toUpperCase();

  // Today's Workout
  let todaysWorkout = null;

  if (latestPlan) {
    todaysWorkout =
      latestPlan.workout_days.find(
        (day) => day.day_name === today
      ) || null;
  }

  return {
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
    },

    onboarding_completed:
      user.onboarding_completed,

    goal_type: user.goal_type,

    gym_level: user.gym_level,

    bmi: latestBodyStat
      ? Number(latestBodyStat.bmi)
      : null,

    bmr: user.bmr,

    daily_calories:
      user.daily_calories,

    daily_water_goal:
      user.daily_water_goal,

    today_workout: todaysWorkout,

    progress: {
      completed_days: 0,
      total_days: latestPlan
        ? latestPlan.workout_days.length
        : 0,
    },
  };
};

module.exports = {
  getDashboard,
};