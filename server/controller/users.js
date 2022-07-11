const dotenv = require('dotenv').config();
const User = require('../schemas/user');
const Bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.SECRET_KEY;
const nodemailer = require('nodemailer');
const user = require('../schemas/user');
const validator = require('email-validator');

// function email_validator(email) {
//   var answer = false;
//   if (email.includes('@')) {
//     var answer = true;
//   }

//   if (email.includes('.') == true) {
//     var answer = true;
//   }

//   if (email.includes('..')) {
//     var answer = false;
//   }

//   if (email.includes) return answer;
// }
// const Message = require('../schemas/messages');

const usersSchema = Joi.object({
  userEmail: Joi.string().required(),
  userName: Joi.string().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{4,12}$')).required(),
  confirmPassword: Joi.string(),
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
        .send({ errorMessage: '이메일 형식이 틀렸습니다.' });
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
  } catch (error) {
    res.status(400).send({
      errorMessage: error + '이메일 혹은 비밀번호가 틀렸습니다.',
    });
  }
}

async function emailFirst(req, res) {
  try {
    //#swagger.tags= ['로그인 API'];
    //#swagger.summary= '로그인 이메일 API'
    //#swagger.description='-'
    const { userEmail } = req.body;
    const userFind = User.findOne({ userEmail });
    if (userFind) {
      res.status(200).send({ email: userEmail, success: true });
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
    }

    if (!validPassword) {
      return res.send('비밀번호가 틀렸습니다.');
    }

    const token = jwt.sign({ userEmail }, jwtSecret, {
      expiresIn: '12000s',
    });
    const refresh_token = jwt.sign({}, jwtSecret, {
      expiresIn: '14d',
    });
    await userFind.update({ refresh_token }, { where: { userEmail } });
    res.status(200).send({ success: true, token });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .send({ errorMessage: error + ' : 로그인에 실패 하였습니다.' });
  }
}

//로그인에서 이메일 입력 (로그인완료, success:존재하는 회원입니다.)
// 그다음 페이지에서 비밀번호 입력

//회원가입 시 이메일 쏘는 부분과 다른 변수 쏘는 api 나누기

// 기존 로그인 api 잠시 주석처리

//로그인
// async function passwordSecond(req, res) {
//   try {
//     const { userEmail, password } = req.body;

//     const userFind = await User.findOne({ userEmail });

//
//     let validPassword = '';

//     if (userFind) {
//       validPassword = await Bcrypt.compare(password, userFind.password);
//     }

//     if (!validPassword) {
//       return res.send('비밀번호가 틀렸습니다..');
//     }

//     const token = jwt.sign({ userEmail }, jwtSecret, {
//       expiresIn: '12000s',
//     });
//     const refresh_token = jwt.sign({}, jwtSecret, {
//       expiresIn: '14d',
//     });
//     await userFind.update({ refresh_token }, { where: { userEmail } });
//     res.status(200).send({ success: '로그인에 성공하였습니다.', token: token });
//   } catch (error) {
//     res
//       .status(400)
//       .send({ errorMessage: message.error + ' : 로그인에 실패하였습니다.' });
//   }
// }

//탈퇴 기능

async function login(req, res) {
  try {
    //#swagger.tags= ['탈퇴 API'];
    //#swagger.summary= '탈퇴 API'
    //#swagger.description='-'
    const { userEmail } = res.locals.user;
    const userFind = await User.deleteOne({ userEmail });
    res.status(200).send({ success: '탈퇴에 성공하였습니다.' });
  } catch {
    console.log(error);
    res.status(400).send({ errorMessage: error + '에러가 발생했습니다..' });
  }
}

module.exports = {
  signup,
  login,
  emailFirst,
  passwordSecond,
};
