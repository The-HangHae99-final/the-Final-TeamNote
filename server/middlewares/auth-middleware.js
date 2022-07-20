const dotenv = require('dotenv').config();

const jwt = require('jsonwebtoken');
const User = require('../schemas/user');
const jwtSecret = process.env.SECRET_KEY;
console.log('jwt secret:', jwtSecret);

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  console.log('authorization--------------------:', authorization);

  if (authorization == null) {
    console.log('authorization: ', authorization);
    res.status(401).send({
      errorMessage: '로그인이 필요합니다.----------null------------',
    });
    return;
  }

  const [tokenType, tokenValue] = authorization.split(' ');
  console.log('tokenValue: ', tokenValue);
  console.log('tokenType: ', tokenType);

  if (tokenType !== 'Bearer') {
    console.log('tokenType: ', tokenType);
    res.status(401).send({
      errorMessage:
        error.message + '로그인이 필요합니다.---------Bearer----------',
    });
    return;
  }

  try {
    const myToken = jwt.verify(tokenValue, jwtSecret);
    console.log('myToken: ', myToken);
    if (myToken == 'jwt expired') {
      // 엑세스 토큰이 만료되었다면,

      const userInfo = jwt.decode(tokenValue, jwtSecret);
      // 원래 값을 디코드 했을 때의 값
      console.log('userInfo: ', userInfo);
      const userEmail = userInfo.userEmail;
      let refresh_token;
      User.findOne({ userEmail }).then((u) => {
        refresh_token = u.refresh_token;
        console.log('refreshToken: ', refresh_token);
        const myRefreshToken = verifyToken(refresh_token);
        console.log('myRefreshToken: ', myRefreshToken);
        if (myRefreshToken == 'jwt expired') {
          console.log('myRefreshToken: ', myRefreshToken);
          res.send({
            errorMessage:
              error.message + '로그인이 필요합니다.---------expired----------',
          });
        } else {
          const myNewToken = jwt.sign({ userEmail: u.userEmail }, jwtSecret, {
            expiresIn: '12000s',
          });
          console.log('3333333333myNewToken3333333333: ', myNewToken);
          res.send({ message: 'new token', myNewToken });
        }
      });
    } else {
      const { userEmail } = jwt.verify(tokenValue, jwtSecret);
      console.log('userEmail ', userEmail);
      User.findOne({ userEmail }).then((u) => {
        res.locals.User = u;
        next();
      });
    }
  } catch (error) {
    console.log('error: ' + error);
    res.send({
      errorMessage: '  로그인이 필요합니다. -----------그외-----------',
      error: error,
    });
  }
};

function verifyToken(token) {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    return error.message;
  }
}
