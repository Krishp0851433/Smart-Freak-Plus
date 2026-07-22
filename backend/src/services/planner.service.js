const prisma = require("../config/prisma");

const getTodayWorkout = async (userId) => {

  // Get today's weekday
  const today = new Date()
    .toLocaleDateString("en-US", {
      weekday: "long",
    })
    .toUpperCase();

  // Find today's workout day
  const workoutDay = await prisma.workout_days.findFirst({
    where: {
      day_name: today,
      workout_plans: {
        user_id: userId,
      },
    },
    include: {
      workout_day_exercises: {
        include: {
          exercise: true,
        },
        orderBy: {
          exercise_order: "asc",
        },
      },
    },
  });

  if (!workoutDay) {
    throw new Error("No workout found for today.");
  }

  return {
    day_name: workoutDay.day_name,
    focus_area: workoutDay.focus_area,

    exercises: workoutDay.workout_day_exercises.map((item) => ({
      id: item.exercise.id,
      exercise_name: item.exercise.exercise_name,
      category: item.exercise.category,
      muscle_group: item.exercise.muscle_group,
      difficulty: item.exercise.difficulty,
      thumbnail: item.exercise.thumbnail,
      video_url: item.exercise.video_url,
      instructions: item.exercise.instructions,
      calories_per_min: item.exercise.calories_per_min,

      sets: item.sets,
      reps: item.reps,
      rest_seconds: item.rest_seconds,
      exercise_order: item.exercise_order,
    })),
  };
};

module.exports = {
  getTodayWorkout,
};