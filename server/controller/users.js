const dotenv = require('dotenv').config();
const User = require('../schemas/user');
const Bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.SECRET_KEY;
const nodemailer = require('nodemailer');
// const Message = require('../schemas/messages');

const postUsersSchema = Joi.object({
  userEmail: Joi.string().required().email(),
  userName: Joi.string().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{4,12}$')).required(),
  confirmPassword: Joi.string(),
});

//회원가입 API
async function signup(req, res) {
  try {
    // const { userEmail, userName, password, confirmPassword } =
    const { userEmail, userName, password, confirmPassword } =
      await postUsersSchema.validateAsync(
        req.body // 임시로 테스트를 위해 로그인을 간편하기 위해
      );

    if (password !== confirmPassword) {
      return res.status(400).send({
        errorMessage: '패스워드가 패스워드 확인란과 동일하지 않습니다.',
      });
    }

    const exitstUsers = await User.find({ userEmail });
    if (exitstUsers.length) {
      return res.status(400).send({
        errorMessage: '중복된 아이디가 존재합니다.',
      });
    }

    const salt = await Bcrypt.genSalt(Number(process.env.SaltKEY));
    const hashPassword = await Bcrypt.hash(password, salt);

    const user = new User({
      userEmail,
      userName,
      password: hashPassword,
    });
    await user.save();
    res.status(201).send({
      success: true,
      msg: '회원가입을 성공하였습니다',
    });

    // res.status(201).send({
    //   ok: true,
    //   result: { user },
    // });
  } catch (error) {
    return res.status(400).send(console.error(error));
  }
}
//로그인
async function login(req, res) {
  try {
    const { userEmail, password } = req.body;

    const userFind = await User.findOne({ userEmail });

    if (!userFind) {
      return res.status(400).send({
        errorMessage: '아이디 또는 비밀번호를 확인해주세요.',
      });
    }

    let validPassword = '';

    if (userFind) {
      validPassword = await Bcrypt.compare(password, userFind.password);
    }

    if (!validPassword) {
      return res.send('비밀번호가 틀렸습니다..');
    }

    const token = jwt.sign({ userEmail }, jwtSecret, {
      expiresIn: '12000s',
    });
    const refresh_token = jwt.sign({}, jwtSecret, {
      expiresIn: '14d',
    });
    await userFind.update({ refresh_token }, { where: { userEmail } });
    res.status(200).send({ message: 'success', token: token });
  } catch (err) {
    res.status(400).send({ message: err + ' : login failed' });
  }
}

module.exports = {
  signup,
  login,
};
