const prisma = require("../src/config/prisma");


const exercises = [

{
 exercise_name:"Chest Press",
 muscle_group:"CHEST",
 difficulty:"BEGINNER"
},

{
 exercise_name:"Bench Press",
 muscle_group:"CHEST",
 difficulty:"INTERMEDIATE"
},

{
 exercise_name:"Push Ups",
 muscle_group:"CHEST",
 difficulty:"BEGINNER"
},


{
 exercise_name:"Lat Pulldown",
 muscle_group:"BACK",
 difficulty:"BEGINNER"
},

{
 exercise_name:"Seated Row",
 muscle_group:"BACK",
 difficulty:"INTERMEDIATE"
},

{
 exercise_name:"Deadlift",
 muscle_group:"BACK",
 difficulty:"ADVANCED"
},


{
 exercise_name:"Squat",
 muscle_group:"LEGS",
 difficulty:"BEGINNER"
},

{
 exercise_name:"Leg Press",
 muscle_group:"LEGS",
 difficulty:"BEGINNER"
},

{
 exercise_name:"Lunges",
 muscle_group:"LEGS",
 difficulty:"BEGINNER"
},


{
 exercise_name:"Shoulder Press",
 muscle_group:"SHOULDERS",
 difficulty:"BEGINNER"
},

{
 exercise_name:"Lateral Raise",
 muscle_group:"SHOULDERS",
 difficulty:"BEGINNER"
},


{
 exercise_name:"Bicep Curl",
 muscle_group:"ARMS",
 difficulty:"BEGINNER"
},

{
 exercise_name:"Tricep Pushdown",
 muscle_group:"ARMS",
 difficulty:"BEGINNER"
},


{
 exercise_name:"Running",
 muscle_group:"CARDIO",
 difficulty:"BEGINNER"
},

{
 exercise_name:"Cycling",
 muscle_group:"CARDIO",
 difficulty:"BEGINNER"
}

];


async function main(){

for(const exercise of exercises){

await prisma.exercises.upsert({

where:{
 id:"00000000-0000-0000-0000-000000000000"
},

update:{},

create:exercise

});

}


console.log("Exercises seeded");

}


main()
.then(async()=>{

await prisma.$disconnect();

})
.catch(async(e)=>{

console.error(e);

await prisma.$disconnect();

process.exit(1);

});