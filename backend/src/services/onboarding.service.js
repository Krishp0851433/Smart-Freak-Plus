const prisma = require("../config/prisma");


// -----------------------------
// Calculate Age
// -----------------------------
const calculateAge = (dateOfBirth) => {

  const today = new Date();
  const birth = new Date(dateOfBirth);

  let age = today.getFullYear() - birth.getFullYear();

  const month =
    today.getMonth() - birth.getMonth();

  if (
    month < 0 ||
    (month === 0 &&
      today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
};


// -----------------------------
// Calculate BMI
// -----------------------------
const calculateBMI = (
  height,
  weight
) => {

  const heightInMeters = height / 100;

  return Number(
    (
      weight /
      (heightInMeters * heightInMeters)
    ).toFixed(2)
  );
};


// -----------------------------
// Calculate BMR
// -----------------------------
const calculateBMR = (
  gender,
  weight,
  height,
  age
) => {

  const normalizedGender =
    gender.toLowerCase();


  if (normalizedGender === "male") {

    return Math.round(
      10 * weight +
      6.25 * height -
      5 * age +
      5
    );

  }


  return Math.round(
    10 * weight +
    6.25 * height -
    5 * age -
    161
  );
};


// -----------------------------
// Calculate Daily Calories
// -----------------------------
const calculateCalories = (
  bmr,
  activityLevel
) => {


  const multipliers = {

    SEDENTARY: 1.2,

    LIGHT: 1.375,

    MODERATE: 1.55,

    ACTIVE: 1.725,

    VERY_ACTIVE: 1.9,

  };


  const multiplier =
    multipliers[
      activityLevel.toUpperCase()
    ];


  if (!multiplier) {

    throw new Error(
      "Invalid activity level"
    );

  }


  return Math.round(
    bmr * multiplier
  );

};



// -----------------------------
// Calculate Water Intake
// -----------------------------
const calculateWater = (
  weight
) => {

  // 35ml per kg body weight

  return Math.round(
    weight * 35
  );

};



// -----------------------------
// Main Onboarding Service
// -----------------------------
const completeOnboarding = async (

  userId,

  data

) => {


  const age = calculateAge(
    data.date_of_birth
  );


  const bmi = calculateBMI(
    data.height,
    data.weight
  );


  const bmr = calculateBMR(

    data.gender,

    data.weight,

    data.height,

    age

  );


  const calories = calculateCalories(

    bmr,

    data.activity_level

  );


  const waterGoal = calculateWater(

    data.weight

  );



  const result = await prisma.$transaction(
    async (tx) => {


      // Update user

      const updatedUser =
        await tx.users.update({

          where: {

            id: userId

          },


          data: {


            gender:
              data.gender,


            date_of_birth:
              new Date(
                data.date_of_birth
              ),


            height:
              data.height,


            weight:
              data.weight,


            goal_type:
              data.goal_type,


            activity_level:
              data.activity_level,


            bmr,


            daily_calories:
              calories,


            daily_water_goal:
              waterGoal,


            onboarding_completed:
              true,

          },

        });



      // Save first body measurement

      await tx.body_stats.create({

        data: {

          user_id:
            userId,


          weight:
            data.weight,


          bmi,

        },

      });



      return updatedUser;

    }

  );



  // Remove password before response

  const {

    password,

    ...safeUser

  } = result;



  return {

    user:
      safeUser,


    bmi,


    bmr,


    calories,


    waterGoal,

  };


};



module.exports = {

  completeOnboarding,

};