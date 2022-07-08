const dotenv = require('dotenv').config();

const jwt = require('jsonwebtoken');
const User = require('../schemas/social_user');
const jwtSecret = process.env.SECRET_KEY;
console.log('jwt secret:', jwtSecret);

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  console.log('authorization', authorization);
  if (authorization == null) {
    res.status(401).send({
      errorMessage: '로그인이 필요합니다.----------null------------',
    });
    return;
  }
  const [tokenType, tokenValue] = authorization.split(' ');
  console.log('tokenValue: ', tokenValue);
  console.log('tokenType: ', tokenType);
  if (tokenType !== 'Bearer') {
    console.log('tokenType ', tokenType);
    res.status(401).send({
      errorMessage: '로그인이 필요합니다.---------Bearer----------',
    });
    return;
  }

  try {
    const myToken = jwt.verify(tokenValue, jwtSecret);
    console.log('myToken: ', myToken);
    if (myToken == 'jwt expired') {
      // access token 만료
      const userInfo = jwt.decode(tokenValue, jwtSecret);
      console.log('userInfo: ', userInfo);
      const userId = userInfo.userEmail;
      let refresh_token;
      User.findOne({ where: userEmail }).then((u) => {
        refresh_token = u.refresh_token;
        console.log('refreshToken: ', refresh_token);
        const myRefreshToken = verifyToken(refresh_token);
        console.log('myRefreshToken: ', myRefreshToken);
        if (myRefreshToken == 'jwt expired') {
          console.log('myRefreshToken: ', myRefreshToken);
          res.send({
            errorMessage: '로그인이 필요합니다.---------expired----------',
          });
        } else {
          const myNewToken = jwt.sign({ email: u.email }, jwtSecret, {
            expiresIn: '1200s',
          });
          console.log('myNewToken: ', myNewToken);
          res.send({ message: 'new token', myNewToken });
        }
      });
    } else {
      const { userId } = jwt.verify(tokenValue, jwtSecret);
      console.log('userEmail ', userId);
      User.findOne({ where: userId }).then((u) => {
        res.locals.User = u;
        next();
      });
    }
  } catch (error) {
    console.log('error: ' + error);
    res.send({
      errorMessage:
        error + ' : 로그인이 필요합니다. -----------그외-----------',
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
