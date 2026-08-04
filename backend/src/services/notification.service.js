const prisma = require("../config/prisma");



// ======================================
// GET USER NOTIFICATIONS
// ======================================

const getNotifications = async(userId)=>{


    const notifications =
        await prisma.notifications.findMany({

            where:{
                user_id:userId
            },

            orderBy:{
                created_at:"desc"
            }

        });



    return notifications;


};




// ======================================
// MARK ALL NOTIFICATIONS READ
// ======================================

const markNotificationsRead = async(userId)=>{


    const updated =
        await prisma.notifications.updateMany({

            where:{
                user_id:userId
            },

            data:{
                is_read:true
            }

        });



    return updated;


};



module.exports={

    getNotifications,

    markNotificationsRead

};