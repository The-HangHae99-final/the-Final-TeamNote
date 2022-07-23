const dotenv = require('dotenv').config();
const axios = require('axios');
const { request } = require('express');
var User = require('../schemas/user');

//로직

var express = require('express');
var router = express.Router();
const KAKAO_OAUTH_TOKEN_API_URL = 'https://kauth.kakao.com/oauth/token';
const KAKAO_GRANT_TYPE = 'authorization_code';
const client_id = process.env.client_id;
console.log('client_id: ' + client_id);
const KAKAO_REDIRECT_URL = 'http://localhost:3000/auth/login/kakao/callback';
const kakaoController = require('../controller/kakaos');

router.post('/auth/login/kakao/callback', kakaoController.kakao_callback);

// 프론트에게서 인가코드를 받는다 post_1
// 서버에서 인가코드를 가지고 카톡에게서 토큰을 받는다.
// 토큰을 클라이언트에게 보낸다.
// 클라이언트가 토큰을 바디에 담아서 다시 post 요청을 한다. post_2
// 백엔드에서 토큰을 가지고 다시 카톡에게 정보를 요청한다.
// 정보를 클라이언트에게 보낸다.
// 클라이언트가 받고 데이터를 파싱해서 다시 보낸다.post_3  // 데이터 파싱문제!!
// 백엔드가 받아서 DB에 저장한다.

// /naver =>/oauth/callback/kakao 인가코드 넘기는 url
// kakao/member token 넘기는 url

router.post('/kakao/member', kakaoController.kakao_member);

router.post('/kakao/parsing', kakaoController.kakao_parsing);
// 예외조건넣기. 유저가 디비에 있으면 저장하지않기.

module.exports = router;