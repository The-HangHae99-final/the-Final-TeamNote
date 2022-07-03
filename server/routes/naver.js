const dotenv = require('dotenv');
dotenv.config();
var axios = require('axios');
var request = require('request');
// router.get('/callback', (req, res) => {
//   const data = req.query.code;
//   console.log(data);
//   res.send(data);
// });

var express = require('express');
var app = express();
var router = express.Router();
var client_id = process.env.YOUR_CLIENT_ID;
var client_secret = process.env.YOUR_CLIENT_SECRET;
var state = 'teamnote';
var redirectURI = encodeURI('http://52.78.168.151:3000/auth/login/callback');
// var server_url = 'http://52.78.168.151:3000';
var request = require('request');
router.post('/naver', function (req, res) {
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
});

router.post('/member', function (req, res) {
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
      console.log(res.end(body));
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
