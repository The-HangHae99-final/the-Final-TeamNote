const User = require('../schemas/user');
const Bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
// const jwtSecret = process.env.SECRET_KEY;
const nodemailer = require('nodemailer');
// const Message = require('../schemas/messages');

const postUsersSchema = Joi.object({
  userId: Joi.string().required().email(),
  userName: Joi.string().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{4,12}$')).required(),
  confirmPassword: Joi.string(),
  profileImage: Joi.string(),
});
//회원가입
async function signup(req, res) {
  try {
    const { userId, userName, password, confirmPassword, profileImage } =
      await postUsersSchema.validateAsync(req.body);

    if (password !== confirmPassword) {
      return res.status(400).send({
        errorMessage: '패스워드가 패스워드 확인란과 동일하지 않습니다.',
      });
    }

    const exitstUsers = await User.find({ userId });
    if (exitstUsers.length) {
      return res.status(400).send({
        errorMessage: '중복된 아이디가 존재합니다.',
      });
    }

    const salt = await Bcrypt.genSalt(Number(process.env.SaltKEY));
    const hashPassword = await Bcrypt.hash(password, salt);

    const user = new User({
      userId,
      userName,
      password: hashPassword,
      profileImage,
    });
    await user.save();
    res.status(201).send({
      ok: true,
      msg: '회원가입을 성공하였습니다',
    });
  } catch (error) {
    return res.status(400).send(console.error(error));
  }
}
//로그인
async function login(req, res) {
  try {
    const { userId, password } = req.body;

    const userFind = await User.findOne({ userId });

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

    const token = jwt.sign({ userId: userId }, 'secret', {
      expiresIn: '1200s',
    });
    const refresh_token = jwt.sign({}, 'secret', {
      expiresIn: '14d',
    });
    await userFind.update({ refresh_token }, { where: { userId: userId } });
    res.status(200).send({ message: 'success', token: token });
  } catch (err) {
    res.status(400).send({ message: err + ' : login failed' });
  }
}

module.exports = {
  signup,
  login,
};
