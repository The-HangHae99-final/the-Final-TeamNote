const { default: axios } = require('axios');
const dotenv = require('dotenv');
dotenv.config();
var axios = require('axios');
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
var api_url = 'http://52.78.168.151';

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
  var request = require('request');
  var options = {
    url: api_url,
    headers: {
      'X-Naver-Client-Id': client_id,
      'X-Naver-Client-Secret': client_secret,
    },
  };
  axios.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
      res.end(body);
    } else {
      res.status(response.statusCode).end();
      console.log('error = ' + response.statusCode);
    }
  });
});

module.exports = router;
