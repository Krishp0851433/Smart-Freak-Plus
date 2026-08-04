const prisma = require("../config/prisma");


// ======================================
// LOCAL AI RESPONSE ENGINE
// ======================================

const generateAIResponse = (message)=>{


    const text = message.toLowerCase();



    if(text.includes("protein")){

        return "Protein helps muscle recovery and growth. A good target is around 1.6 to 2.2 grams of protein per kg of body weight for active people.";

    }



    if(text.includes("weight loss") || text.includes("lose weight")){

        return "For weight loss focus on a calorie deficit, high protein meals, strength training and consistent daily activity.";

    }



    if(text.includes("workout") || text.includes("exercise")){

        return "A balanced workout should include strength training, cardio, recovery days and progressive overload.";

    }



    if(text.includes("diet") || text.includes("food")){

        return "A good fitness diet includes lean protein, complex carbs, healthy fats, vegetables and enough water.";

    }



    if(text.includes("motivation")){

        return "Consistency beats perfection. Small daily improvements create long term fitness results.";

    }



    return "Stay consistent with your workouts, nutrition and recovery. Track your progress and keep improving every day.";

};




// ======================================
// SAVE CHAT
// ======================================

const chatWithAI = async(userId,message)=>{


    const response = generateAIResponse(message);



    const chat =
        await prisma.ai_chat.create({

            data:{

                user_id:userId,

                user_message:message,

                ai_response:response

            }

        });



    return chat;


};




// ======================================
// HISTORY
// ======================================

const getAIHistory = async(userId)=>{


    return await prisma.ai_chat.findMany({

        where:{

            user_id:userId

        },

        orderBy:{

            created_at:"desc"

        }

    });


};



module.exports={

    chatWithAI,

    getAIHistory

};