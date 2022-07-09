const dotenv = require('dotenv');
const naverController = require('../controller/navers');
dotenv.config();
var axios = require('axios');
var request = require('request');

var User = require('../schemas/user');
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
router.post('/naver', naverController.naver);

router.post('/member', naverController.naver_member);

router.post('/parsing', naverController.naver_parsing);
module.exports = router;