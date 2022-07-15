const express = require('express');
const router = express.Router();
const User = require('../schemas/user');
const nodemailer = require('nodemailer');
const { response } = require('express');

async function manito_(req, res, next) {
  //#swagger.tags= ['마니또 API'];
  //#swagger.summary= '마니또 API'
  //#swagger.description='-'
  try {
    const emailBox = [];
    const userFind = await User.find({});
    let manito = '';
    console.log(userFind);

    for (let i = 0; i < userFind.length; i++) {
      emailBox.push(userFind[i].userEmail);
    }
    min = Math.ceil(0);
    max = Math.floor(userFind.length);

    Email = emailBox[Math.floor(Math.random() * (max - min)) + min];

    const emailFind = await User.findOne({ Email });
    res.send({ manito: emailFind.userName, success: true });

    let transporter = nodemailer.createTransport({
      service: 'naver', // 메일 이용할 서비스
      host: 'smtp.naver.com', // SMTP 서버명
      port: 587, // SMTP 포트
      auth: {
        user: 'hanghae99@naver.com', // 사용자 이메일
        pass: process.env.password, // 사용자 패스워드
      },
    });

    // 메일 옵션
    let mailOptions = {
      from: 'hanghae99@naver.com', // 메일 발신자
      to: Email, // 메일 수신자

      // 회원가입 완료하고 축하 메시지 전송할 시
      // to: req.body.userid
      subject: `${emailFind.userName}님 마니또가 배정되었습니다..`, // 메일 제목
      html: `<h2>${emailFind.userName}님의 마니또가 배정되었습니다.</h2>
            <h2>즐거운 하루 보내세요-!!</h2>
    
            <p><img src= 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK0SAoLYOpmnAffwHHWCELREMb2jmrNKAlbA&usqp=CAU'width=400, height=200/></p>`,
    };
    // 메일 발송
    transporter.sendMail(mailOptions, function (err, success) {
      if (err) {
        console.log(err);
      } else {
        console.log('Email sent successfully!');
      }
    });
  } catch (error) {
    console.log(error);
    res.send({ success: false, errorMessage: error });
  }
}

// random 장치
// min = Math.ceil(min);
// max = Math.floor(max);
// [Math.floor(Math.random() * (max - min)) + min];

module.exports = {
  manito_,
};
