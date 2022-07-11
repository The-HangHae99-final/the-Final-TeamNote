const dotenv = require('dotenv').config();
const User = require('../schemas/user');
const Bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.SECRET_KEY;
const nodemailer = require('nodemailer');
const user = require('../schemas/user');
const validator = require('email-validator');
const passwordValidator = require('../../server/controller/util/passwordValidator');

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
        .send({ success: false, errorMessage: '이메일 형식이 틀렸습니다.' });
    }

    if (passwordValidator(password) != true) {
      return res
        .status(400)
        .send({ success: false, errorMessage: '패스워드 형식이 틀렸습니다.' });
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
      success: false,
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
      return res.status(400).send('비밀번호가 틀렸습니다.');
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
  emailFirst,
  passwordSecond,
  deleteUser,
};
