const express = require("express");

const router = express.Router();


const notificationController =
require("../controllers/notification.controller");


const auth =
require("../middleware/auth.middleware");




// GET notifications

router.get(
"/",
auth,
notificationController.getNotifications
);




// Mark read

router.put(
"/read",
auth,
notificationController.markRead
);



module.exports = router;