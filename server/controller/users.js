const dotenv = require('dotenv').config();
const User = require('../schemas/user');
const Bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.SECRET_KEY;
const nodemailer = require('nodemailer');
const user = require('../schemas/user');
const validator = require('email-validator');
const { response } = require('express');
const { error } = require('winston');

const usersSchema = Joi.object({
  userEmail: Joi.string().required().email(),
  userName: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
});

//회원가입 API
async function signup(req, res) {
  try {
    //#swagger.tags= ['회원가입 API'];
    //#swagger.summary= '회원가입 API'
    //#swagger.description='-'
    // const { userEmail, userName, password, confirmPassword } =
    const { userEmail, userName, password, confirmPassword } =
      await usersSchema.validateAsync(
        req.body // 임시로 테스트를 위해 로그인을 간편하기 위해
      );

    if (password !== confirmPassword) {
      return res.status(400).send({
        errorMessage: '패스워드가 패스워드 확인란과 동일하지 않습니다.',
      });
    }

    if (validator.validate(userEmail) == false) {
      return res
        .status(400)
        .send({ success: false, errorMessage: '이메일 형식이 틀렸습니다.' });
    }

    if (password.length < 4) {
      return res
        .status(400)
        .send({ success: false, errorMessage: '비밀번호는 4글자 이상입니다.' });
    }

    const exitstUsers = await User.findOne({ userEmail });
    if (exitstUsers) {
      return res.status(400).send({
        errorMessage: '중복된 이메일이 존재합니다.',
      });
    }

    const salt = await Bcrypt.genSalt(Number(process.env.SaltKEY));
    const hashPassword = await Bcrypt.hash(password, salt);
    let site = 0;
    const user = new User({
      userEmail,
      userName,
      password: hashPassword,
      site,
    });
    await user.save();
    res.status(201).send({
      success: true,
      msg: '회원가입을 성공하였습니다',
    });

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
      to: req.body.userEmail, // 메일 수신자

      // 회원가입 완료하고 축하 메시지 전송할 시
      // to: req.body.userid
      subject: `${req.body.userName}님 팀노트 회원가입을 축하합니다.`, // 메일 제목
      html: `<h2>${req.body.userName}님의 팀 협업 행복을 응원합니다.</h2>
            <br/>
            <p>협업, 일정등록부터 커리어 성장, 사이드 프로젝트까지!</p>
            <p>팀노트 200% 활용법을 확인해 보세요.</p>
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
    res.status(401).send({
      success: false,
      errorMessage: error + '특정할 수 없는 에러가 발생했습니다..',
    });
  }
}

async function emailFirst(req, res) {
  try {
    //#swagger.tags= ['로그인 API'];
    //#swagger.summary= '로그인 이메일 API'
    //#swagger.description='-'
    const { userEmail } = req.body;
    console.log('userEmail: ', userEmail);
    const userFind = await User.findOne({ userEmail });

    console.log('userFind----------- ', userFind);

    if (!userFind) {
      console.log(userFind);
      res.status(400).json({ success: false });
    } else {
      res.status(200).json({ success: true, errorMessage: error });
    }
  } catch (error) {
    res.send(401).send({ errorMessage: error });
  }
}

async function passwordSecond(req, res) {
  try {
    //#swagger.tags= ['로그인 API'];
    //#swagger.summary= '로그인 패스워드 API'
    //#swagger.description='-'
    const { userEmail, password } = req.body;
    const userFind = await User.findOne({ userEmail });
    var validPassword;
    if (userFind) {
      validPassword = await Bcrypt.compare(password, userFind.password);

      if (validPassword == 'false') {
        res.status(400).send({
          success: true,
          errorMessage: '유효하지 않은 비밀번호입니다.',
        });
      }
    }

    const token = jwt.sign({ userEmail }, jwtSecret, {
      expiresIn: '12000s',
    });
    const refresh_token = jwt.sign({}, jwtSecret, {
      expiresIn: '14d',
    });
    await userFind.update({ refresh_token }, { where: { userEmail } });
    res.status(200).send({
      success: true,
      token,
      email: userEmail,
      name: userFind.userName,
    });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .send({ errorMessage: error + ' : 로그인에 실패 하였습니다.' });
  }
}

//탈퇴 기능

async function deleteUser(req, res) {
  try {
    //#swagger.tags= ['탈퇴 API'];
    //#swagger.summary= '탈퇴 API'
    //#swagger.description='-'
    const { userEmail } = req.params;
    console.log(userEmail);
    await User.deleteOne({ userEmail });
    res.status(200).send({ success: '탈퇴에 성공하였습니다.' });
  } catch {
    console.log(error);
    res.status(400).send({ errorMessage: error + '에러가 발생했습니다..' });
  }
}

//유저 검색
async function searchUser(req, res){
  try{
    const { userEmail } = req.body;
    const existUser = await User.findOne({ userEmail });

    if(existUser)
    {
      res.status(200).send({ email: existUser.userEmail, name: existUser.userName  });
    } 
    else{
      res.status(400).send({ errorMessage: '존재하지 않는 유저입니다.'})
    }
  }
  catch{
    console.log(error);
    res.status(400).send({ errorMessage: error + '에러가 발생했습니다..' });
  }
}

module.exports = {
  signup,
  emailFirst,
  passwordSecond,
  deleteUser,
  searchUser
};
