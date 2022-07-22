const dotenv = require('dotenv').config();
// const Acess_ = require('../schemas/access_token');
var express = require('express');
var router = express.Router();
const axios = require('axios');
const { request } = require('express');
const jwt = require('jsonwebtoken');
var User = require('../schemas/user');
const jwtSecret = process.env.SECRET_KEY;
const { smtpTransport } = require('../controller/util/email');

// 프론트에게서 인가코드를 받는다 post_1
// 서버에서 인가코드를 가지고 카톡에게서 토큰을 받는다.
// 토큰을 클라이언트에게 보낸다.
// 클라이언트가 토큰을 바디에 담아서 다시 post 요청을 한다. post_2
// 백엔드에서 토큰을 가지고 다시 카톡에게 정보를 요청한다.
// 정보를 클라이언트에게 보낸다.
// 클라이언트가 받고 데이터를 파싱해서 다시 보낸다.post_3  // 데이터 파싱문제!!
// 백엔드가 받아서 DB에 저장한다.

var generateRandom = function (min, max) {
  var ranNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return ranNum;
};
// Rediect URI : http://localhost:3000/auth/login/kakao/callback
//로직
var express = require('express');
var router = express.Router();
const KAKAO_OAUTH_TOKEN_API_URL = 'https://kauth.kakao.com/oauth/token';
const KAKAO_GRANT_TYPE = 'authorization_code';
const client_id = process.env.client_id;
const KAKAO_REDIRECT_URL = 'http://localhost:3000/oauth/kakao/callback';
// post- '/auth/login/kakao/callback'
// 프론트에게 인가코드 받고, 엑세스 토큰 발급받아 프론트에게 다시 넘겨주기.
function kakao_callback(req, res, next) {
  try {
    //#swagger.tags= ['카카오 API'];
    //#swagger.summary= '카카오 콜백 API'
    //##swagger.description='-'
    let code = req.body.code;
    console.log('인가 코드' + code);
    try {
      axios
        .post(
          `${KAKAO_OAUTH_TOKEN_API_URL}?grant_type=${KAKAO_GRANT_TYPE}&client_id=${client_id}&redirect_uri=${KAKAO_REDIRECT_URL}&code=${code}`,
          {
            headers: {
              'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
          }
        )
        .then((result) => {
          console.log('result-------------' + result);
          res.send(result.data['access_token']);
          // 토큰을 활용한 로직을 적어주면된다.
        })
        .catch((error) => {
          console.log(error);
          res.send(error);
        });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  } catch (err) {
    res.status(400).send({
      success: false,
      errorMessage: error.message,
      message: '에러가 발생했습니다.',
    });
    // console.log('error =' + err);
    console.log(message.err);
  }
}

// router.post - '/kakao/member'
// 토큰을 가지고 카카오에 유저정보 요청하기. 유저정보 받고 파싱을 위해 클라이언트에게 다시 전송
function kakao_member(req, res) {
  try {
    //#swagger.tags= ['카카오 API'];
    //#swagger.summary= '카카오 정보요청 API'
    //##swagger.description='-'
    var api_url = 'https://kapi.kakao.com/v2/user/me';
    var request = require('request');
    var token = req.body.token;
    console.log('token------------', token);
    var header = 'Bearer ' + token; // Bearer 다음에 공백 추가
    console.log('header: ' + header);
    var options = {
      url: api_url,
      headers: { Authorization: header }, // 중요
    };
    request.get(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
        res.end(body);
        console.log(body);
      } else {
        console.log('error');
        if (response != null) {
          res.status(response.statusCode).end();
          console.log('error = ' + response.statusCode);
        }
      }
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      errorMessage: error.message,
      message: '에러가 발생했습니다.',
    });
    console.log('error =' + error);
  }
}
// post -'/kakao/parsing'
// 프론트에서 파싱한 데이터 받고, DB에 유저정보 저장하기
async function kakao_parsing(req, res) {
  try {
    //#swagger.tags= ['카카오 API'];
    //#swagger.summary= '카카오 파싱 API'
    //##swagger.description='-'
    const site = 1; //kakao
    const user_info = req.body;
    const userEmail = user_info.user_email;
    const userName = user_info.user_name;
    console.log('userName---: ', userName);
    const double = await User.findOne({ userEmail });
    console.log('double--- ', double);

    // userName로 토큰값 만들기

    var token = jwt.sign({ userEmail }, jwtSecret, {
      expiresIn: '1h',
    });

    // 만약 디비에 user의 email이 없다면,

    if (!double) {
      // 이메일 인증하기
      const social = new User({ userEmail, userName, site }); // auth는 false 디폴트
      // 저장하기
      social.save();
      res.send({ token });
    } else {
      double.userName == userName;
      // 닉네임이 같다면 통과.
      // 만약 디비에 user의 email이 있다면,
      // 기존에서 리프레시 토큰만 대체하기
      res.send({ token });
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      errorMessage: error.message,
      message: '에러가 발생했습니다.',
    });
    console.log('error =' + error);
  }
}

module.exports = {
  kakao_callback,
  kakao_member,
  kakao_parsing,
};
