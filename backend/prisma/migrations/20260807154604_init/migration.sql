-- CreateTable
CREATE TABLE "ai_chat" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "user_message" TEXT NOT NULL,
    "ai_response" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "body_stats" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "weight" DECIMAL(5,2),
    "body_fat" DECIMAL(5,2),
    "muscle_mass" DECIMAL(5,2),
    "bmi" DECIMAL(5,2),
    "recorded_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "body_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diet_plans" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "plan_name" VARCHAR(255),
    "daily_calories" INTEGER,
    "protein_target" INTEGER,
    "carb_target" INTEGER,
    "fat_target" INTEGER,
    "created_by_ai" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "diet_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "exercise_id" UUID NOT NULL,
    "sets" INTEGER,
    "reps" INTEGER,
    "weight_used" DECIMAL(6,2),
    "duration" INTEGER,
    "calories_burned" DECIMAL(8,2),
    "completed_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercise_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "exercise_name" VARCHAR(255) NOT NULL,
    "category" VARCHAR(100),
    "muscle_group" VARCHAR(100),
    "video_url" TEXT,
    "instructions" TEXT,
    "calories_per_min" DECIMAL(5,2),
    "difficulty" VARCHAR(50),
    "thumbnail" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goals" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "goal_name" VARCHAR(255) NOT NULL,
    "target_weight" DECIMAL(5,2),
    "target_calories" INTEGER,
    "target_date" DATE,
    "status" VARCHAR(50) DEFAULT 'active',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "meal_name" VARCHAR(255),
    "calories" INTEGER,
    "protein" DECIMAL(8,2),
    "carbs" DECIMAL(8,2),
    "fats" DECIMAL(8,2),
    "meal_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meal_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "title" VARCHAR(255),
    "message" TEXT,
    "is_read" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "full_name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "gender" VARCHAR(20),
    "date_of_birth" DATE,
    "height" DECIMAL(5,2),
    "weight" DECIMAL(5,2),
    "goal_type" VARCHAR(50),
    "activity_level" VARCHAR(50),
    "profile_image" TEXT,
    "is_verified" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "apple_id" TEXT,
    "google_id" TEXT,
    "onboarding_completed" BOOLEAN NOT NULL DEFAULT false,
    "bmr" INTEGER,
    "daily_calories" INTEGER,
    "daily_water_goal" INTEGER,
    "gym_level" VARCHAR(50),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "water_tracking" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "amount_ml" INTEGER NOT NULL,
    "logged_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "water_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_days" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workout_plan_id" UUID NOT NULL,
    "day_name" VARCHAR(20) NOT NULL,
    "focus_area" VARCHAR(100),

    CONSTRAINT "workout_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_plans" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "plan_name" VARCHAR(255) NOT NULL,
    "goal_type" VARCHAR(100),
    "created_by_ai" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workout_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "user_agent" TEXT,
    "ip_address" TEXT,
    "device_name" VARCHAR(255),
    "is_valid" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_verification_tokens" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_day_exercises" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workout_day_id" UUID NOT NULL,
    "exercise_id" UUID NOT NULL,
    "sets" INTEGER,
    "reps" INTEGER,
    "rest_seconds" INTEGER,
    "exercise_order" INTEGER,

    CONSTRAINT "workout_day_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_ai_chat_user" ON "ai_chat"("user_id");

-- CreateIndex
CREATE INDEX "idx_body_stats_user" ON "body_stats"("user_id");

-- CreateIndex
CREATE INDEX "idx_exercise_logs_user" ON "exercise_logs"("user_id");

-- CreateIndex
CREATE INDEX "idx_goals_user" ON "goals"("user_id");

-- CreateIndex
CREATE INDEX "idx_meal_logs_user" ON "meal_logs"("user_id");

-- CreateIndex
CREATE INDEX "idx_notifications_user" ON "notifications"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_apple_id_key" ON "users"("apple_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

-- CreateIndex
CREATE INDEX "idx_users_email" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_water_tracking_user" ON "water_tracking"("user_id");

-- CreateIndex
CREATE INDEX "idx_workout_plans_user" ON "workout_plans"("user_id");

-- CreateIndex
CREATE INDEX "idx_refresh_tokens_user" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "idx_sessions_user" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "password_reset_tokens_user_id_idx" ON "password_reset_tokens"("user_id");

-- CreateIndex
CREATE INDEX "email_verification_tokens_user_id_idx" ON "email_verification_tokens"("user_id");

-- CreateIndex
CREATE INDEX "workout_day_exercises_workout_day_id_idx" ON "workout_day_exercises"("workout_day_id");

-- CreateIndex
CREATE INDEX "workout_day_exercises_exercise_id_idx" ON "workout_day_exercises"("exercise_id");

-- AddForeignKey
ALTER TABLE "ai_chat" ADD CONSTRAINT "fk_ai_chat_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "body_stats" ADD CONSTRAINT "fk_body_stats_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "diet_plans" ADD CONSTRAINT "fk_diet_plan_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exercise_logs" ADD CONSTRAINT "fk_exercise_log_exercise" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exercise_logs" ADD CONSTRAINT "fk_exercise_log_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "fk_goals_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "meal_logs" ADD CONSTRAINT "fk_meal_log_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "fk_notification_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "water_tracking" ADD CONSTRAINT "fk_water_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "workout_days" ADD CONSTRAINT "fk_workout_day_plan" FOREIGN KEY ("workout_plan_id") REFERENCES "workout_plans"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "workout_plans" ADD CONSTRAINT "fk_workout_plan_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_verification_tokens" ADD CONSTRAINT "email_verification_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_day_exercises" ADD CONSTRAINT "workout_day_exercises_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_day_exercises" ADD CONSTRAINT "workout_day_exercises_workout_day_id_fkey" FOREIGN KEY ("workout_day_id") REFERENCES "workout_days"("id") ON DELETE CASCADE ON UPDATE CASCADE;
