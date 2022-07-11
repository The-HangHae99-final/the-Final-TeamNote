const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const messageController = require("../controller/messages");

router.put("/messages/edit/:_id", authMiddleware, messageController.messageEdit);

router.delete("/messages/delete/:_id", authMiddleware, messageController.messageDelete);

router.get("/messages/view/:_id", messageController.messagesView); 

module.exports = router;


