const jwt = require('jsonwebtoken');
const User = require('../schemas/social_user');
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  console.log('authorization----------------11111', authorization);
  if (authorization == null) {
    res.status(401).send({
      errorMessage: '로그인이 필요합니다.----------null------------',
    });
    return;
  }
  const [tokenType, tokenValue] = authorization.split(' ');
  console.log('tokenValue----------------2222: ', tokenValue);
  console.log('tokenType---------------------3333: ', tokenType);
  if (tokenType !== 'Bearer') {
    console.log('tokenType-------------444444 ', tokenType);
    res.status(401).send({
      errorMessage: '로그인이 필요합니다.---------Bearer----------',
    });
    return;
  }

  try {
    const myToken = jwt.verify(tokenValue, 'secret');
    console.log('myToken-----------------555555: ', myToken);
    if (myToken == 'jwt expired') {
      // access token 만료
      const userInfo = jwt.decode(tokenValue, 'secret');
      console.log('userInfo----------6666666: ', userInfo);
      const userId = userInfo.userId;
      let refresh_token;
      User.findOne({ where: userId }).then((u) => {
        refresh_token = u.refresh_token;
        console.log(
          'refreshToken-----------------77777777777: ',
          refresh_token
        );
        const myRefreshToken = verifyToken(refresh_token);
        console.log(
          'myRefreshToken------------------8888888888888: ',
          myRefreshToken
        );
        if (myRefreshToken == 'jwt expired') {
          console.log('myRefreshToken-----------: ', myRefreshToken);
          res.send({
            errorMessage: '로그인이 필요합니다.---------expired----------',
          });
        } else {
          const myNewToken = jwt.sign({ userId: u.userId }, 'secret', {
            expiresIn: '1200s',
          });
          console.log('myNewToken: ', myNewToken);
          res.send({ message: 'new token', myNewToken });
        }
      });
    } else {
      const { userId } = jwt.verify(tokenValue, 'secret');
      console.log('userId: ', userId);
      User.findOne({ where: userId }).then((u) => {
        res.locals.User = u;
        next();
      });
    }
  } catch (err) {
    console.log('에러받아라-------------------------' + err);
    res.send({
      errorMessage: err + ' : 로그인이 필요합니다. -----------그외-----------',
    });
  }
};
function verifyToken(token) {
  try {
    return jwt.verify(token, 'secret');
  } catch (error) {
    return error.message;
  }
}
