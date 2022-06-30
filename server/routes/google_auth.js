const express = require('express');

const router = express.Router();
// const passport = require('../config/passport.js');

// // 로그인 API

// router.get('/login', (req, res) => {
//   res.render('auth/login');
// });

// // 로그아웃 API
// router.get('/logout', (req, res) => {
//   req.logout();
//   res.redirect('/');
// });

// // 구글로 로그인하기 Router
// router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// // 그리고 passport 로그인 전략에 의해 googleStrategy로 가서 구글계정 정보와 DB를 비교해서 회원가입시키거나 로그인 처리하게 한다.
// router.get('/google/callback', passport.authenticate('google'), authSuccess);

// function authSuccess(req, res) {
//   res.redirect('/main');
// }

module.exports = router;
