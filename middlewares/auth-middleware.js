const jwt = require('jsonwebtoken');
const user = require('../schemas/user');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization == null) {
    res.status(401).send({
      message: '로그인을 먼저 해 주세요.',
    });
    return;
  }

  const [tokenType, tokenValue] = authorization.split(' ');

  if (tokenType !== 'Bearer') {
    res.status(401).send({
      message: '로그인을 먼저 해 주세요.',
    });
    return;
  }

  try {
    const myToken = verifyToken(tokenValue);
    if (myToken == 'jwt expired') {
      // access token 만료
      const userInfo = jwt.decode(tokenValue, 'secret');
      const userId = userInfo.userId;
      let refreshToken;
      user.findOne({ where: userId }).then((user) => {
        refreshToken = user.refreshToken;
        const myRefreshToken = verifyToken(refreshToken);
        if (myRefreshToken == 'jwt expired') {
          res.send({ message: '토큰이 만료되었습니다. 다시 로그인 해주세요.' });
        } else {
          const myNewToken = jwt.sign({ userId: user.userId }, 'secret', {
            expiresIn: '3600s',
          });
          res.send({ message: 'new token', myNewToken });
        }
      });
    } else {
      const { userId } = jwt.verify(tokenValue, 'secret');
      user.findOne({ userId }).then((user) => {
        res.locals.user = user;
        next();
      });
    }
  } catch (err) {
    res.send({ message: '로그인을 먼저 해 주세요.' });
  }
};

function verifyToken(token) {
  try {
    return jwt.verify(token, 'secret');
  } catch (error) {
    return error.message;
  }
}