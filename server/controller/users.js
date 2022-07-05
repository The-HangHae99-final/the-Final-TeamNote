const User = require("../schemas/user");
const Bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
// const jwtSecret = process.env.SECRET_KEY;
const nodemailer = require("nodemailer");
// const Message = require('../schemas/messages');

const postUsersSchema = Joi.object({
  userid: Joi.string().required().email(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{4,12}$")).required(),
  confirmpassword: Joi.string(),
});

async function signup(req, res) {
  try {
    const { userid, password, confirmpassword } =
      await postUsersSchema.validateAsync(req.body);

    if (password !== confirmpassword) {
      return res.status(400).send({
        errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
      });
    }

    const exitstUsers = await User.find({ userid });
    if (exitstUsers.length) {
      return res.status(400).send({
        errorMessage: "중복된 아이디가 존재합니다.",
      });
    }

    const salt = await Bcrypt.genSalt(Number(process.env.SaltKEY));
    const hashPassword = await Bcrypt.hash(password, salt);

    const user = new User({
      userid,
      password: hashPassword,
    });
    await user.save();

    res.status(201).send({
      ok: true,
      result: { user },
    });
  } catch (error) {
    return res.status(400).send(console.error(error));
  }
}

async function login(req, res) {
  try {
    const { userid, password } = req.body;

    const user_find = await User.findOne({ userid });

    if (!user_find) {
      return res.status(400).send({
        errorMessage: "아이디 또는 비밀번호를 확인해주세요.",
      });
    }

    let validPassword = "";

    if (user_find) {
      validPassword = await Bcrypt.compare(password, user_find.password);
    }

    if (!validPassword) {
      return res.send("비밀번호가 틀렸습니다..");
    }

    const token = jwt.sign({ userid: userid }, "secret", {
      expiresIn: "1200s",
    });
    const refresh_token = jwt.sign({}, "secret", {
      expiresIn: "14d",
    });
    await user_find.update({ refresh_token }, { where: { userid: userid } });
    res.status(200).send({ message: "success", token: token });
  } catch (err) {
    res.status(400).send({ message: err + " : login failed" });
  }
}

// async function getuser(req, res)
module.exports = {
  signup,
  login,
};
