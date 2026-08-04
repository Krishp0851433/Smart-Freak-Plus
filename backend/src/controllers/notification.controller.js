const notificationService =
require("../services/notification.service");




// ======================================
// GET /notifications
// ======================================

const getNotifications = async(req,res)=>{


    try{


        const userId = req.user.userId;



        const notifications =
            await notificationService.getNotifications(

                userId

            );



        return res.status(200).json({

            success:true,

            count:notifications.length,

            data:notifications

        });



    }catch(error){


        console.error(
            "Get Notifications Error:",
            error
        );


        return res.status(500).json({

            success:false,

            message:error.message

        });


    }


};





// ======================================
// PUT /notifications/read
// ======================================

const markRead = async(req,res)=>{


    try{


        const userId = req.user.userId;



        const result =
            await notificationService.markNotificationsRead(

                userId

            );



        return res.status(200).json({

            success:true,

            message:"Notifications marked as read",

            data:result

        });



    }catch(error){


        console.error(
            "Mark Notifications Read Error:",
            error
        );


        return res.status(500).json({

            success:false,

            message:error.message

        });


    }


};




module.exports={

    getNotifications,

    markRead

};