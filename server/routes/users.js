const dotenv = require('dotenv');

dotenv.config();
const express = require('express');
const router = express.Router();
const userController = require('../controller/users');

//회원가입 - 개인
router.post('/users/signup', userController.signup);

router.get('/users', userController.all);

router.post('/users/email', userController.emailFirst);

router.post('/users/password', userController.passwordSecond);

router.delete('/users/delete/:userEmail', userController.deleteUser);

router.get('/users/search', userController.search);

router.post('/users/mailing', userController.mailing);

module.exports = router;
