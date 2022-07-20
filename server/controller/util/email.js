const dotenv = require('dotenv').config();
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'naver', // 메일 이용할 서비스
  host: 'smtp.naver.com', // SMTP 서버명
  port: 587, // SMTP 포트
  auth: {
    user: 'hanghae99@naver.com', // 사용자 이메일
    pass: process.env.password, // 사용자 패스워드
  },
});
