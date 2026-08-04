const express = require("express");

const router = express.Router();


const aiController =
require("../controllers/ai.controller");


const auth =
require("../middleware/auth.middleware");



// POST /ai/chat

router.post(
"/chat",
auth,
aiController.chat
);



// GET /ai/history

router.get(
"/history",
auth,
aiController.history
);



module.exports=router;