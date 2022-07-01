const dotenv = require('dotenv').config();

var express = require('express');
var router = express.Router();
const KAKAO_OAUTH_TOKEN_API_URL = 'https://kauth.kakao.com/oauth/token';
const grant_type = 'authorization_code';
const client_id = process.env.client_id;
const redirect_uri = 'http://localhost:3000/oauth/callback/kakao';
const axios = require('axios');

let access_token = '';

router.get('/oauth/callback/kakao', function (req, res, next) {
  let code = req.query.code;
  console.log('code: ', code);
  // console.log('redirect_uri: ', redirect_uri);
  // console.log('client_id: ', client_id);
  // console.log('grant_type: ', grant_type);
  // console.log(KAKAO_OAUTH_TOKEN_API_URL);

  try {
    axios
      .post(
        `${KAKAO_OAUTH_TOKEN_API_URL}?grant_type=${grant_type}&client_id=${client_id}&redirect_uri=${redirect_uri}&code=${code}`,

        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Content-Type': 'application / json',
          },
        }
      )
      .then((result) => {
        // console.log('result:', result);
        // console.log('엑세스 토큰:', result.data['access_token']);
        access_token = result.data['access_token'];
        res.send(result['access_token']);

        // 토큰을 활용한 로직을 적어주면된다.
        // url, 화면전환 코드 작성!
      })
      .catch((e) => {
        console.log(e);
        res.send(e);
      });
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});
console.log(access_token);
router.get('/kakao/information', function (req, res, next) {
  console.log(access_token);
  res.send(access_token);
});

router.post('/google/information', function (req, res, next) {
  res.send('hi');
});

router.post('/naver/information', function (req, res, next) {
  const data = req.body;
  console.log('data:', data);
  res.send(data);
});

// router.get('/oauth/:coperation', async (req, res) => {
//   const coperation = req.params.coperation;
//   const code = req.param('code');
//   const options = getOption(coperation, code);
//   const token = await getAccessToken(options);
//   const userInfo = await getUserInfo(options.userInfoUrl, token.access_token);

//   // TODO Redirect Frot Server (쿠키, 세션, local_store 중에 로그인을 유지한다.)
//   // TODO Data Base or 쿠키 reflesh Token 저장 방법 모색
//   res.send(userInfo);
// });

// 리다이렉트될 화면

// const React = require('react');
// const { useEffect } = require('react');
// const { useParams } = require('react-router-dom');
// const axios = require('axios');

// // import { useParams } from 'react-router-dom';
// // import axios from 'axios';
// // // import { instance } from '../servers/axios';

// const KakaoCallback = () => {
//   // const params = useParams();
//   // const code = params.get("code");
//   // params = new URL(window.location.toString()).searchParams;
//   console.log(window.location.href);
//   console.log(new URL(window.location.href).searchParams.get('code'));
//   const code = new URL(window.location.href).searchParams.get('code');

//   useEffect(() => {
//     const Kakao = async (code) => {
//       return await axios.post(`/auth/kakao?code=${code}`).then(() => {
//         console.log(code);
//       });
//     };
//   }, []);

//   return (
//     <>
//       <p>Waiting...</p>
//     </>
//   );
// };

// export default KakaoCallback;

module.exports = router;
