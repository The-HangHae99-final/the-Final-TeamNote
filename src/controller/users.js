const dotenv = require('dotenv').config();
const User = require('../models/user');
const Bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.SECRET_KEY;
const nodemailer = require('nodemailer');
const validator = require('email-validator');
const { response } = require('express');
const { error } = require('winston');
const ejs = require('ejs');
const path = require('path');
const { info } = require('console');
let appDir = path.dirname(require.main.filename);
const usersSchema = Joi.object({
  userEmail: Joi.string().required(),
  userName: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
});

const transporter = nodemailer.createTransport({
  service: 'naver', // 메일 이용할 서비스
  host: 'smtp.naver.com', // SMTP 서버명
  port: 587, // SMTP 포트
  auth: {
    user: 'hanghae99@naver.com', // 사용자 이메일
    pass: process.env.password, // 사용자 패스워드
  },
});

module.exports = {
  transporter,
};

//회원가입 API
// router.post('/users/signup', userController.signup);
async function signup(req, res, next) {
  try {
    //#swagger.tags= ['회원가입 API'];
    //#swagger.summary= '회원가입 API'
    //#swagger.description='-'
    let profile_image =
      'https://user-images.githubusercontent.com/85288036/182856054-28299fde-3326-46b9-a1e8-faa43b54ef2d.png';
    const { userEmail, userName, password, confirmPassword } =
      await usersSchema.validateAsync(req.body);
    // 비밀번호와 확인 비밀번호가 틀린 경우
    if (password !== confirmPassword) {
      return res.status(400).send({
        errorMessage: '비밀번호가 일치하지 않습니다.',
      });
    }
    // 비밀번호가 5글자 이하인 경우
    if (password.length <= 5) {
      return res.status(400).send({
        success: false,
        errorMessage: '비밀번호는 6글자 이상으로 입력해주세요.',
      });
    }
    // userName의 length가 6글자 이상인 경우.
    if (userName.length >= 6) {
      return res.status(400).send({
        success: false,
        errorMessage: '닉네임은 5글자 이내로 입력해주세요.',
      });
    }
    // email validator 라이브러리로 이메일 검사.
    if (!validator.validate(userEmail)) {
      console.log(!validator.validate(userEmail));
      return res
        .status(400)
        .send({ success: false, errorMessage: '이메일 형식이 틀렸습니다.' });
    }

    // 가입하고자 하는 이메일이 존재하는 경우
    const exitstUsers = await User.findOne({ userEmail });

    if (exitstUsers) {
      return res.status(400).send({
        errorMessage: '중복된 이메일이 존재합니다.',
      });
    }
    // 비밀번호 해시화
    const salt = await Bcrypt.genSalt(Number(process.env.SaltKEY));
    const hashPassword = await Bcrypt.hash(password, salt);
    let site = 0;
    const user = new User({
      userEmail,
      userName,
      password: hashPassword,
      site,
      profile_image,
    });

    // 가입 축하  이메일 발송 기능
    let mailOptions = {
      from: 'hanghae99@naver.com', // 메일 발신자
      to: req.body.userEmail, // 메일 수신자

      // 회원가입 완료하고 축하 메시지 전송할 시
      // to: req.body.userid
      subject: `${req.body.userName}님 팀노트 회원가입을 축하합니다.`, // 메일 제목, 템플릿
      html: `<h2>${req.body.userName}님의 팀 협업 행복을 응원합니다.</h2> 
            <br/>
            <p>협업, 일정등록부터 커리어 성장, 사이드 프로젝트까지!</p>
            <p>팀노트 200% 활용법을 확인해 보세요.</p><br>
            <p><img src= 'https://user-images.githubusercontent.com/85288036/180214057-40f5be9a-fef7-4251-b45c-59f1d5e5d9a7.png'width=400, height=200/></p>`,
    };
    //메일 발송
    transporter.sendMail(mailOptions, async function (next, err, success) {
      if (err) {
        return err;
      } else {
        next();
      }
    });

    // DB에 저장
    const createdUser = await user.save();
    res.status(201).json({
      createdUser,
      success: true,
      message: '회원가입을 성공하였습니다',
    });
  } catch (error) {
    res.status(401).send({
      success: false,
      errorMessage: error.message,
    });
  }
}

// 이메일부터 DB에 있는지 먼저 검사한다.
// router.post('/users/email', userController.emailFirst);
// async function emailFirst(req, res) {
//   try {
//     //#swagger.tags= ['로그인 API'];
//     //#swagger.summary= '로그인 이메일 API'
//     //#swagger.description='-'
//     const { userEmail } = req.body;
//     const userFind = await User.findOne({ userEmail });

//     if (!validator.validate(userEmail)) {
//       return res
//         .status(400)
//         .send({ success: false, errorMessage: '이메일 형식이 틀렸습니다.' });
//     }
//     // userFind값이 없다면 == DB에 userEmail값이 없다면.
//     if (!userFind) {
//       console.log(userFind);
//       res
//         .status(400)
//         .json({ success: false, errorMessage: '존재하지 않는 유저입니다.' });
//     } else {
//       res.status(200).json({ success: true, message: '존재하는 유저입니다.' });
//     }
//   } catch (error) {
//     console.log(error);
//     res.send(401).send({
//       message: '예상치 못한 에러가 발생했습니다.',
//       errorMessage: error,
//     });
//   }
// }

// 이메일과 비밀번호를 body값으로 받고 로그인
// router.post('/users/login', userController.login);
async function login(req, res, next) {
  try {
    //#swagger.tags= ['로그인 API'];
    //#swagger.summary= '로그인 패스워드 API'
    //#swagger.description='-'
    const { userEmail, password } = req.body;
    console.log('userEmail,password', userEmail, password);
    const userFind = await User.findOne({ userEmail });
    let validPassword;

    if (!userEmail || !password) {
      res.status(400).send({
        success: false,
        errorMessage: '이메일 또는 비밀번호가 입력되지 않았습니다.',
      });
    } else if (!userFind) {
      res
        .status(400)
        .send({ success: false, errorMessage: '일치하는 이메일이 없습니다.' });
    }

    // 유저가 DB에 존재하고,
    if (userFind) {
      validPassword = await Bcrypt.compare(password, userFind.password);

      if (validPassword) {
        //jwt token화
        const token = jwt.sign({ userEmail }, jwtSecret, {
          expiresIn: '30m',
        });

        // 리프레시 토큰 생성
        const refresh_token = jwt.sign({}, jwtSecret, {
          expiresIn: '1d',
        });
        await userFind.update({ refresh_token }, { $where: { userEmail } });
        res.status(200).send({
          success: true,
          message: '로그인에 성공하였습니다.',
          token,
          userEmail: userEmail,
          userName: userFind.userName,
        });
      } else {
        res
          .status(400)
          .send({ success: false, errorMessage: '비밀번호가 틀렸습니다.' });
      }
    }
  } catch (error) {
    // 에러가 뜰 경우 잡아서 리턴한다.
    console.log('error----' + error);
  }
}

//회원 탈퇴 기능
// router.delete('/users/delete/:userEmail', userController.deleteUser')
async function deleteUser(req, res) {
  try {
    //#swagger.tags= ['탈퇴 API'];
    //#swagger.summary= '탈퇴 API'
    //#swagger.description='-'
    const { userEmail } = req.params;
    if (!userEmail) {
      res.status(404).json({
        success: false,
        errorMessage: '입력된 유저 이메일 값이 없습니다.',
      });
    }
    await User.deleteOne({ userEmail });
    res.status(200).send({ success: '탈퇴에 성공하였습니다.' });
  } catch {
    console.log(error);
    res.status(400).send({
      succss: false,
      errorMessage: error.message,
      message: '예상치 못한 에러가 발생했습니다.',
    });
  }
}

//가입된 유저 확인
// router.get('/users', userController.all);
async function all(req, res) {
  try {
    //#swagger.tags= ['회원 확인용 API'];
    //#swagger.summary= '회원 확인용 API'
    //#swagger.description='-'

    const userAll = await User.find({});
    res.status(200).send({ userAll: userAll, success: true });
  } catch (error) {
    res.status(400).send({ errorMessage: error.message, success: false });
  }
}

//유저 검색기능
// router.get('/users/search', userController.searchUser);
async function searchUser(req, res) {
  try {
    //#swagger.tags= [' 유저 검색 API'];
    //#swagger.summary= '유저 검색 API'
    //#swagger.description='-'

    const { userEmail } = req.body;
    const existUser = await User.findOne({ userEmail });

    if (!userEmail) {
      res.status(404).json({
        success: false,
        errorMessage: '입력된 유저 이메일 값이 없습니다.',
      });
    }

    if (existUser) {
      res.status(200).send({
        success: true,
        email: existUser.userEmail,
        name: existUser.userName,
      });
    } else {
      res
        .status(400)
        .send({ success: false, errorMessage: '존재하지 않는 유저입니다.' });
    }
  } catch {
    console.log(error);
    res.status(400).send({
      success: false,
      errorMessage: error.message,
      message: '예상치 못한 에러가 발생했습니다.',
    });
  }
}

// 회원가입 - 인증코드 이메일로 보내기 - 보류
// router.post('/users/mailing', userController.mailing);
async function mailing(req, res) {
  //#swagger.tags= [' 인증코드 메일링 API'];
  //#swagger.summary= '인증코드 메일링 API'
  //#swagger.description='-'

  min = Math.ceil(111111);
  max = Math.floor(999999);
  const number = Math.floor(Math.random() * (max - min)) + min;
  const { userEmail } = req.body;

  // 메일 옵션
  let mailOptions = {
    from: 'hanghae99@naver.com', // 메일 발신자
    to: userEmail, // 메일 수신자

    // 회원가입 완료하고 축하 메시지 전송할 시
    // to: req.body.userid
    subject: `고객님의 팀노트 회원가입을 축하합니다.`, // 메일 제목
    html: `<h2>고객님의 팀 협업 행복을 응원합니다.</h2>
          <br/>
          <p>협업, 일정등록부터 커리어 성장, 사이드 프로젝트까지!</p>
          <p>팀노트 200% 활용법을 확인해 보세요.</p>
          <p> 옆의 숫자를 입력해주세요.--- ${number} ---</p>
          <p><img src= 'https://user-images.githubusercontent.com/85288036/180214057-40f5be9a-fef7-4251-b45c-59f1d5e5d9a7.png'width=400, height=200/></p>`,
  };
  // 메일 발송
  transporter.sendMail(mailOptions, function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log('이메일이 성공적으로 발송되었습니다!');
    }
  });
  res.send({ success: true, number: number }); //인증번호 인증기능.
}

async function findUser(req, res, next) {
  try {
    const { userEmail } = req.body;
    const existUser = await User.findOne({ userEmail });

    if (existUser) {
      await User.findOne({ userEmail }).then((u) => {
        res.locals.existUser = u;
        next();
      });
    } else {
      res
        .status(400)
        .send({ success: false, errorMessage: '존재하지 않는 유저입니다.' });
    }
  } catch {
    console.log(error);
    res.status(400).send({
      success: false,
      errorMessage: error.message,
      message: '유저검색 에러가 발생했습니다.',
    });
  }
}

async function myPage(req, res, next) {
  try {
    const { userEmail } = res.locals.User;
    const { image_number } = req.body;

    let image = '';

    if (!image_number) {
      return res
        .status(400)
        .json({ message: '이미지 숫자를 입력해주세요', success: false });
    }

    if (image_number == 1) {
      image =
        'https://user-images.githubusercontent.com/85288036/182821554-c8fa080c-be3f-41bf-a11c-9563bdf6834a.png';
    }
    if (image_number == 2) {
      image =
        'https://user-images.githubusercontent.com/85288036/182821565-7338e6ac-d18e-4c85-8f69-76ad0baf7ced.png';
    }
    if (image_number == 3) {
      image =
        'https://user-images.githubusercontent.com/85288036/182821570-b312a17a-8267-43a5-95c2-f034cc70eeea.png';
    }
    if (image_number == 4) {
      image =
        'https://user-images.githubusercontent.com/85288036/182821574-c3245d4e-c558-40eb-a2a5-1581f54bd29c.png';
    }
    if (image_number == 5) {
      image =
        'https://user-images.githubusercontent.com/85288036/182821581-27c938cb-b55a-46cb-8060-99aad141150e.png';
    }
    if (image_number == 6) {
      image =
        'https://user-images.githubusercontent.com/85288036/182821586-8cf063aa-bf90-46f9-aff0-1ab15c49e181.png';
    }
    if (image_number == 7) {
      image =
        'https://user-images.githubusercontent.com/85288036/182821590-b5df015b-89cf-4a12-be65-745cd064b7d0.png';
    }
    if (image_number == 8) {
      image =
        'https://user-images.githubusercontent.com/85288036/182821593-06648c45-8009-4014-9dfa-15083bb4c31b.png';
    }
    const updatedImage = await User.updateOne(
      { userEmail },
      { $set: { profile_image: image } }
    );
    const findUser = await User.findOne({ userEmail });

    return res.status(200).json({
      updatedImage,
      findUser,
      success: 'true',
      message: '이미지 수정에 성공했습니다.',
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: 'false',
      message: '예상치 못한 에러가 발생했습니다.',
      // errorMessage: error.message,
    });
  }
}

async function allUser(req, res, next) {
  try {
    const All = await User.find({});

    res.status(200).send(All);
  } catch (error) {
    res.status(400).send(error.message);
    console.log(error);
  }
}
module.exports = {
  signup,
  login,
  deleteUser,
  all,
  searchUser,
  mailing,
  findUser,
  myPage,
  allUser,
};
