// 모듈 및 설정파일
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const communityController = require('../controller/community');

//커뮤니티 페이지 조회
router.get('/communities', authMiddleware, communityController.communitypage);

//채팅조회
router.get('/chat/lists', communityController.getchat);

module.exports = router;
