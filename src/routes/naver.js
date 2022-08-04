const dotenv = require('dotenv');
const naverController = require('../controller/navers');
dotenv.config();
const axios = require('axios');
const request = require('request');

const User = require('../models/user');
// router.get('/callback', (req, res) => {
//   const data = req.query.code;
//   console.log(data);
//   res.send(data);
// });

const express = require('express');
const app = express();
const router = express.Router();
const client_id = process.env.YOUR_CLIENT_ID;
const client_secret = process.env.YOUR_CLIENT_SECRET;
const state = 'teamnote';
const redirectURI = encodeURI(
  'http://teamnote-dev.s3-website.ap-northeast-2.amazonaws.com/api/auth/login/naver/callback'
);
// const server_url = 'http://52.78.168.151:3000';
// var request = require('request');
router.post('/naver', naverController.naver);

router.post('/member', naverController.naver_member);

router.post('/parsing', naverController.naver_parsing);
module.exports = router;
