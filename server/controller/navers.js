const dotenv = require('dotenv');
dotenv.config();
var axios = require('axios');
var request = require('request');
var User = require('../schemas/user');
var express = require('express');
var app = express();
var router = express.Router();
var client_id = process.env.YOUR_CLIENT_ID;
var client_secret = process.env.YOUR_CLIENT_SECRET;
var state = 'teamnote';
var redirectURI = encodeURI('http://52.78.168.151:3000/auth/login/callback');
// var server_url = 'http://52.78.168.151:3000';
var request = require('request');

// router.post('/naver',

function naver(req, res) {
  try {
    //#swagger.tags= ['네이버 API'];
    //#swagger.summary= '네이버 콜백 API'
    //#swagger.description='-'
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

// router.post('/member'
function naver_member(req, res) {
  try {
    //#swagger.tags= ['네이버 API'];
    //#swagger.summary= '네이버 정보요청 API'
    //#swagger.description='-'
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

// router.post('/parsing',
async function naver_parsing(req, res) {
  try {
    //#swagger.tags= ['네이버 API'];
    //#swagger.summary= '네이버 파싱 API'
    //#swagger.description='-'
    const site = 2; //naver
    const user_info = req.body;
    // console.log(user_info);
    // console.log(user_info.user_name);
    const _user = user_info.user_id;
    const userEmail = user_info.user_email;
    const userName = user_info.user_name;
    const double = await User.findOne({ userEmail });

    if (!double) {
      const social = new User({ userName, userEmail, site });
      social.save();
      res.send('저장에 성공하였습니다.');
    } else {
      res.send('이미 있는 유저입니다.');
    }
  } catch (err) {
    res.status(400).send('에러가 발생했습니다.');
    console.log('error =' + err);
  }

  // 예외조건넣기. 유저가 디비에 있으면 저장하지않기.
}

module.exports = {
  naver,
  naver_member,
  naver_parsing,
};
