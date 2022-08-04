const dotenv = require('dotenv');
const authMiddleware = require('../middlewares/authMiddleware');

dotenv.config();
const express = require('express');
const router = express.Router();
const userController = require('../controller/users');

//회원가입 - 개인
router.post('/signup', userController.signup);

// 로그인
router.post('/login', userController.login);

// 회원탈퇴
router.delete('/:userEmail', userController.deleteUser);
// 회원검색
router.get('/search', userController.searchUser);
// 가입자 이메일 보내기
router.post('/mailing', userController.mailing);
// 마이페이지 - 프로필 이미지 바꾸기
router.patch('/mypage/profile', authMiddleware, userController.myPage);
// 모든 가입 유저 검색 (개발용))
router.get('/allUser', userController.allUser);

module.exports = router;
