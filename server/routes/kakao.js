const dotenv = require('dotenv').config();
// const Acess_ = require('../schemas/access_token');
var express = require('express');
var router = express.Router();
const KAKAO_OAUTH_TOKEN_API_URL = 'https://kauth.kakao.com/oauth/token';
const grant_type = 'authorization_code';
const client_id = process.env.client_id;
const redirect_uri = 'http://localhost:3000/oauth/callback/kakao';
const axios = require('axios');
const { request } = require('express');

//로직

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

let access_token = '';

router.post('/oauth/callback/kakao', async function (req, res, next) {
  let code = req.query.code;
  console.log('code: ', code);
  // console.log('redirect_uri: ', redirect_uri);
  // console.log('client_id: ', client_id);
  // console.log('grant_type: ', grant_type);
  // console.log(KAKAO_OAUTH_TOKEN_API_URL);
  var header = 'Bearer ' + token;
  var api_url = `${KAKAO_OAUTH_TOKEN_API_URL}?grant_type=${grant_type}&client_id=${client_id}&redirect_uri=${redirect_uri}&code=${code}`;
  var options = {
    url: api_url,

    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Content-Type': 'application / json',
    },
  };
  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
      res.end(body);
    } else {
      console.log('error');
      if (response != null) {
        res.status(response.statusCode).end();
        console.log('error = ' + response.statusCode);
      }
    }
  });
});
router.post('/kakao/member', function (req, res) {
  var api_url = 'https://kapi.kakao.com/v2/user/me';
  var request = require('request');
  var token = req.body.token;
  var header = 'Bearer ' + token; // Bearer 다음에 공백 추가
  var options = {
    url: api_url,
    headers: { Authorization: header },
  };
  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
      res.end(body);
    } else {
      console.log('error');
      if (response != null) {
        res.status(response.statusCode).end();
        console.log('error = ' + response.statusCode);
      }
    }
  });
});

module.exports = router;
