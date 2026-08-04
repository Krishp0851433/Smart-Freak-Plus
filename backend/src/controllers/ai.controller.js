const aiService =
require("../services/ai.service");




// ======================================
// POST /ai/chat
// ======================================

const chat = async(req,res)=>{


    try{


        const userId = req.user.userId;



        const {
            message
        } = req.body;



        if(!message){

            return res.status(400).json({

                success:false,

                message:"Message required"

            });

        }



        const result =
        await aiService.chatWithAI(

            userId,

            message

        );



        return res.status(200).json({

            success:true,

            data:result

        });



    }catch(error){


        console.error(
            "AI Chat Error:",
            error
        );


        return res.status(500).json({

            success:false,

            message:error.message

        });


    }


};




// ======================================
// GET /ai/history
// ======================================

const history = async(req,res)=>{


    try{


        const userId = req.user.userId;



        const chats =
        await aiService.getAIHistory(

            userId

        );



        return res.status(200).json({

            success:true,

            count:chats.length,

            data:chats

        });



    }catch(error){


        console.error(
            "AI History Error:",
            error
        );


        return res.status(500).json({

            success:false,

            message:error.message

        });


    }


};



module.exports={

    chat,

    history

};