const dotenv = require('dotenv');
dotenv.config();
var axios = require('axios');
var request = require('request');
var socialUser = require('../schemas/social_user');
var express = require('express');
var app = express();
var router = express.Router();
var client_id = process.env.YOUR_CLIENT_ID;
var client_secret = process.env.YOUR_CLIENT_SECRET;
var state = 'teamnote';
var redirectURI = encodeURI('http://52.78.168.151:3000/auth/login/callback');
var request = require('request');

// post-naver
// 프론트에게서 인가코드 받고, api_url로 정보를 요청해서 access_token 등 data를 돌려받는다.

function naver(req, res) {
  try {
    var code = req.body.code;
    console.log('code:', code);
    var state = 'teamnote';
    console.log('state:', state);
    api_url =
      'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=' +
      client_id +
      '&client_secret=' +
      client_secret +
      '&code=' +
      code +
      '&state=' +
      state;
    var options = {
      url: api_url,
      headers: {
        'X-Naver-Client-Id': client_id,
        'X-Naver-Client-Secret': client_secret,
      },
    };
    request.get(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
        res.end(body);
        console.log('res:', res);
      } else {
        res.status(response.statusCode).end();
        console.log('error = ' + response.statusCode);
      }
    });
  } catch (err) {
    res.status(400).send('오류가 발생했습니다.');
    console.log('error +', err);
  }
}

// post - member
// 네이버 api에 정보요청해서 정보 받아오기

function naver_member(req, res) {
  try {
    var api_url = 'https://openapi.naver.com/v1/nid/me';
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
  } catch (err) {
    res.status(400).send('에러가 발생했습니다');
    console.log(err);
  }
}

// post - parsing
// 프론트에서 파싱해서 돌려주는 것 받아서 변수에 저장, DB에 저장하기

async function naver_parsing(req, res) {
  try {
    const site = 2; // naver는 사이트 2로 표현한다.
    const user_info = req.body;
    const _user = user_info.user_id;
    const email = user_info.user_email;
    const userId = user_info.user_name;
    const double = await socialUser.findOne({ email });

    if (!double) {
      const social = new socialUser({ userId, email, _user, site });
      social.save();
      res.send('저장에 성공하였습니다.');
    } else {
      res.send('이미 있는 유저입니다.');
    }
  } catch (err) {
    res.status(400).send('에러가 발생했습니다.');
    console.log('error =' + err);
  }
}

module.exports = {
  naver,
  naver_member,
  naver_parsing,
};
