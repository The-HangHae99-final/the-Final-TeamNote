const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const messageController = require('../controller/messages');
const isMember = require('../middlewares/isMember');

//메시지 수정
router.put('/message/:_id',authMiddleware, isMember, messageController.messageEdit);

//메시지 삭제
router.delete('/message/:_id',authMiddleware,messageController.messageDelete);

//메시지 조회
router.get('/message/:_id', authMiddleware, isMember, messageController.messagesView);

//룸 이름 얻기
router.get('/roomId/:workSpaceName/:opponent', authMiddleware, isMember, messageController.getRoomId);

module.exports = router;
