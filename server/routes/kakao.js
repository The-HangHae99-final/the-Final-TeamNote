const dotenv = require('dotenv').config();
// const Acess_ = require('../schemas/access_token');
var express = require('express');
var router = express.Router();
const KAKAO_OAUTH_TOKEN_API_URL = 'https://kauth.kakao.com/oauth/token';
const grant_type = 'authorization_code';
const client_id = process.env.client_id;
const redirect_uri = 'http://localhost:3000/oauth/callback/kakao';
const axios = require('axios');

// global.access_token = access_token;
// var user;
// global.user = user;

// router.get('/oauth/callback/kakao', async function (req, res, next) {
//   let code = req.query.code;
//   console.log('code: ', code);
//   // console.log('redirect_uri: ', redirect_uri);
//   // console.log('client_id: ', client_id);
//   // console.log('grant_type: ', grant_type);
//   // console.log(KAKAO_OAUTH_TOKEN_API_URL);

//   try {
//     axios
//       .post(
//         `${KAKAO_OAUTH_TOKEN_API_URL}?grant_type=${grant_type}&client_id=${client_id}&redirect_uri=${redirect_uri}&code=${code}`,

//         {
//           headers: {
//             'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//             'Content-Type': 'application / json',
//           },
//         }
//       )
//       .then((result) => {
//         // console.log('result:', result);
//         // console.log('엑세스 토큰:', result.data['access_token']);
//         let access_token = result.data['access_token'];
//         console.log('access_token:', access_token);
//         res.send(result['access_token']);

//         // 토큰을 활용한 로직을 적어주면된다.
//         // url, 화면전환 코드 작성!
//       })
//       .catch((e) => {
//         console.log(e);
//         res.send(e);
//       });
//   } catch (e) {
//     console.log(e);
//     res.send(e);
//   }
// });
//   try {
//     console.log('access_token222222:', access_token); //access정보를 가지고 또 요청해야 정보를 가져올 수 있음.
//     user = await axios({
//       method: 'get',
//       url: 'https://kapi.kakao.com/v2/user/me',
//       headers: {
//         Authorization: `Bearer ${access_token}`,
//       }, //헤더에 내용을 보고 보내주겠다.
//     });
//     // console.log(access_token);
//   } catch (e) {
//     res.json(e.data);
//   }
//   console.log('user:', user);

//   // req.session.kakao = user.data;
//   //req.session = {['kakao'] : user.data};
// });
//
router.get('/kakao/information', function (req, res, next) {
  console.log(access_token);
  res.send(access_token);
});

router.get('/google/information', function (req, res, next) {
  res.send('hi');
});

module.exports = router;
