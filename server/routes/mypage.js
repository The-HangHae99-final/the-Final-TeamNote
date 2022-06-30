const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const mypageController = require('../controller/mypage');

//북마크 on/off , 마이페이지에 채용정보 담거나 빼기.
router.put('/mark/:postingid', authMiddleware, mypageController.bookmark)

//마이페이지 조회(북마크 목록 불러오기)
router.get('/mypage', authMiddleware, mypageController.mypage)


module.exports = router;
