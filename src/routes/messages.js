const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const messageController = require("../controller/messages");
const isMember = require("../middlewares/isMember");

//메시지 수정
router.put("/:_id", authMiddleware, isMember, messageController.editMessage);

//메시지 삭제
router.delete("/:_id", authMiddleware, messageController.deleteMessage);

//메시지 조회
router.get("/:_id", authMiddleware, isMember, messageController.showMessage);

module.exports = router;
