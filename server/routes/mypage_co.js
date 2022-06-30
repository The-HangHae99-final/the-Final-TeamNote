// 모듈 및 설정파일
const express = require('express');
const router = express.Router();
const authMiddlewareCo = require('../middlewares/auth-middleware-co');
const coMypageController = require("../controller/mypage_co");

// 회사 마이페이지 조회
router.get('/companies/mypage', authMiddlewareCo, coMypageController.companiesmypage);

module.exports = router;
