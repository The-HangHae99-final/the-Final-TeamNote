const dotenv = require('dotenv');
const authMiddleware = require('../middlewares/authMiddleware');

dotenv.config();
const express = require('express');
const router = express.Router();
const userController = require('../controller/users');

//회원가입 - 개인
router.post('/signup', userController.signup);

router.get('/', userController.all);

router.post('/login', userController.login);

router.delete('/:userEmail', userController.deleteUser);

router.get('/search', userController.searchUser);

router.post('/mailing', userController.mailing);

router.patch('/mypage/profile', authMiddleware, userController.myPage);

router.get('/allUser', userController.allUser);

module.exports = router;
